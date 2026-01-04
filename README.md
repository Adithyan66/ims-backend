# Inventory Management System - Backend

A comprehensive backend API for an Inventory Management System built with Express.js, MongoDB Atlas, and following MVC architecture.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Inventory Management**: Full CRUD operations for inventory items with search functionality
- **Customer Management**: CRUD operations for customer records
- **Sales Management**: Record sales with automatic inventory deduction
- **Reports**: Sales reports, items reports, and customer ledger
- **Email Service**: Send sales reports via email using nodemailer

## Tech Stack

- **Node.js** with **Express.js**
- **MongoDB Atlas** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **nodemailer** for email functionality
- **express-validator** for input validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Email account for SMTP (Gmail, Outlook, etc.)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and replace `<password>` with your database user password
6. Add the connection string to your `.env` file as `MONGODB_URI`

## SMTP Configuration

### Gmail Setup

1. Enable 2-Step Verification on your Google Account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the app password in `SMTP_PASS` in your `.env` file

### Other Email Providers

Update the SMTP settings in `.env`:
- **Outlook**: `smtp-mail.outlook.com`, port `587`
- **Yahoo**: `smtp.mail.yahoo.com`, port `587`
- **Custom SMTP**: Use your provider's SMTP settings

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`)

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ "name": "string", "email": "string", "password": "string" }`
  
- `POST /api/auth/login` - Login user
  - Body: `{ "email": "string", "password": "string" }`
  - Returns: JWT token

### Items

- `GET /api/items` - Get all items (supports `?q=search` query)
- `GET /api/items/search?q=query` - Search items by name/description
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create item (Auth required)
  - Body: `{ "name": "string", "description": "string", "quantity": number, "price": number }`
- `PUT /api/items/:id` - Update item (Auth required)
- `DELETE /api/items/:id` - Delete item (Auth required)

### Customers

- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get single customer
- `POST /api/customers` - Create customer (Auth required)
  - Body: `{ "name": "string", "address": "string", "mobileNumber": "string" }`
- `PUT /api/customers/:id` - Update customer (Auth required)
- `DELETE /api/customers/:id` - Delete customer (Auth required)

### Sales

- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get single sale
- `POST /api/sales` - Create sale (Auth required)
  - Body: `{ "itemId": "ObjectId", "quantity": number, "customerId": "ObjectId" (optional), "isCash": boolean, "date": "ISO date" (optional) }`
- `PUT /api/sales/:id` - Update sale (Auth required)
- `DELETE /api/sales/:id` - Delete sale (Auth required, restores inventory)

### Reports

- `GET /api/reports/sales` - Get sales report (returns JSON for frontend export)
- `GET /api/reports/items` - Get items report (returns JSON for frontend export)
- `GET /api/reports/customers/:id/ledger` - Get customer ledger (returns JSON for frontend export)
- `POST /api/reports/sales/email` - Send sales report via email (Auth required)

## Authentication

Most endpoints require authentication. Include the JWT token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "status": "success",
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error message",
  "errors": [ ... ] // Optional validation errors
}
```

## Features Details

### Inventory Auto-Deduction
When a sale is created, the item quantity is automatically deducted. If a sale is deleted, the quantity is restored.

### Cash Sales
For cash sales, set `isCash: true` and omit `customerId`. The system will handle it as a walk-in customer sale.

### Search Functionality
Items can be searched by name or description using MongoDB text search. Use the `?q=query` parameter in the GET `/api/items` endpoint.

### Email Reports
The email endpoint sends a formatted HTML table with all sales data to the authenticated user's email address.

## Error Handling

The API includes comprehensive error handling:
- Validation errors (400)
- Authentication errors (401)
- Not found errors (404)
- Server errors (500)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   ├── Customer.js
│   │   └── Sale.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── itemController.js
│   │   ├── customerController.js
│   │   ├── saleController.js
│   │   └── reportController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── saleRoutes.js
│   │   └── reportRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── response.js
│   │   └── emailService.js
│   └── app.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

