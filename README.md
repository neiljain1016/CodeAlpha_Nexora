
# Nexora – E-Commerce Website

Nexora is a full-stack e-commerce web application developed as part of the CodeAlpha Internship Program. It allows users to browse products, create accounts, log in, add products to their cart, place orders, and view their order history.

## Features

- User Registration and Login
- Secure Password Hashing
- JWT Authentication
- Product Listing
- Product Search
- Product Details
- Shopping Cart
- Order Placement
- Stock Management
- My Orders Dashboard
- MongoDB Database Integration
- Responsive User Interface

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Project Structure

```text
Nexora/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── login.html
│   ├── auth.js
│   ├── orders.html
│   └── orders.js
│
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md

```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
```

### 2. Open the Project

```bash
cd CodeAlpha_EcommerceStore
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory.

Add your own configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_private_secret_key
```

Never upload your `.env` file to GitHub.

### 5. Start the Backend

```bash
npm run dev
```

The backend runs at:

http://localhost:5000

### 6. Open the Frontend

Open `frontend/index.html` using VS Code Live Server.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/products | Get all products |
| POST | /api/products | Add a product |
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get user profile |
| POST | /api/orders | Place an order |
| GET | /api/orders/my-orders | Get user orders |

## Database

MongoDB is used to store:

- User information
- Product information
- Order information

Passwords are hashed using bcryptjs.

## Developer

Developed as a CodeAlpha Internship Project.

**Project Name:** Nexora  
**Category:** Full-Stack Web Development
