
const express = require("express");
const router = express.Router();

const Order = require("../models/order");
const Product = require("../models/product");
const authMiddleware = require("../middleware/authMiddleware");

// Place a new order
router.post("/", authMiddleware, async (req, res) => {
    const reservedProducts = [];

    try {
        const { items, shippingAddress } = req.body;

        if (!Array.isArray(items) || items.length === 0 || !shippingAddress) {
            return res.status(400).json({
                message: "Please provide products and shipping address"
            });
        }

        const orderItems = [];
        let totalAmount = 0;

        // Check product details and stock
        for (const item of items) {
            const quantity = Number(item.quantity);

            if (!Number.isInteger(quantity) || quantity < 1) {
                return res.status(400).json({
                    message: "Invalid product quantity"
                });
            }

            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            if (product.stock < quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}`
                });
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity
            });

            totalAmount += product.price * quantity;
        }

        // Reduce stock safely
        for (const item of orderItems) {
            const updatedProduct = await Product.findOneAndUpdate(
                {
                    _id: item.product,
                    stock: { $gte: item.quantity }
                },
                {
                    $inc: { stock: -item.quantity }
                },
                { new: true }
            );

            if (!updatedProduct) {
                throw new Error(`Insufficient stock for ${item.name}`);
            }

            reservedProducts.push(item);
        }

        // Save order in MongoDB
        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress
        });

        res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        // Restore stock if order creation fails
        for (const item of reservedProducts) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
});


// Get all orders of the logged-in user
router.get("/my-orders", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.id
        })
        .populate("items.product", "name image")
        .sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;
