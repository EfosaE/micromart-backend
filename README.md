# Micromart Backend

Micromart is a backend service for an e-commerce platform built using the [NestJS](https://nestjs.com) framework. It provides APIs for managing products, users, authentication, payments, and more. This project is designed to be scalable, efficient, and developer-friendly.

## Features

- **Authentication**: User and vendor registration, login, and Google OAuth integration.
- **Product Management**: APIs for creating, retrieving, and filtering products by tags, categories, and price ranges.
- **Payment Integration**: Paystack integration for creating payment requests.
- **Cloudinary Integration**: Image upload and management for products.
- **Event-Driven Architecture**: Event emitters for handling user-related events like sending welcome emails.
- **Validation and Security**: DTO validation, role-based access control, and JWT-based authentication.
- **Swagger Documentation**: Auto-generated API documentation.

## Project Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A PostgreSQL database
- Cloudinary account for image uploads
- Paystack account for payment processing

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/efosae/micromart-backend.git
   cd micromart-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PAYSTACK_BASE_URL=https://api.paystack.co
   TEST_SECRET_KEY=your_paystack_secret_key
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

### Running the Application

- **Development Mode**:
  ```bash
  npm run start:dev
  ```

- **Production Mode**:
  ```bash
  npm run start:prod
  ```

- **Testing**:
  ```bash
  npm run test
  ```

## API Documentation

The API is documented using Swagger. Once the application is running, you can access the documentation at:

```
http://localhost:4000/api/v1/docs
```

### Key Endpoints

#### Authentication

- **Register User**: `POST /auth/register/user`
- **Register Vendor**: `POST /auth/register/vendor`
- **Login**: `POST /auth/login`
- **Google OAuth**: `GET /auth/google`

#### Products

- **Get All Products**: `GET /products`
- **Get Categories**: `GET /products/categories`
- **Get Tags**: `GET /products/tags`
- **Create Product**: `POST /products` (Admin/Vendor only)

#### Payments

- **Create Payment Request**: `POST /payment`

## Development Notes

### Middleware and Guards

- **Global Prefix**: All routes are prefixed with `/api/v1`.
- **Validation**: DTO validation is enforced using `ValidationPipe`.
- **Authentication**: JWT-based authentication is implemented with role-based access control.

### Event Handling

The application uses an event-driven architecture for handling user-related events. For example, a welcome email is sent when a new user is created.

### Seeding Data

To seed the database with sample data, run:
```bash
npm run seed
```

## Deployment

For deployment, ensure the environment variables are correctly configured. You can deploy the application to platforms like AWS, Heroku, or Vercel.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.