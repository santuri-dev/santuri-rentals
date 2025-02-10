# Backend Architecture

## Technology Stack

- **Runtime**: Bun
- **Framework**: Elysia.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Email**: Nodemailer
- **Payments**: IntaSend

## Core Components

### API Server

The backend is built using Elysia.js, providing a modular API structure with the following key features:

- Route handling
- Middleware support
- Request validation
- Error handling
- Swagger documentation

### Database Layer

PostgreSQL database accessed through Prisma ORM, providing:

- Type-safe queries
- Migration management
- Relationship handling
- Data validation

### Authentication System

JWT-based authentication with:

- Access tokens
- Refresh tokens
- Token rotation
- Session management

### Email Service

Nodemailer integration for:

- Verification emails
- Password reset
- Notifications
- Booking confirmations

### Payment Processing

IntaSend integration handling:

- Payment processing
- Transaction management
- Payment verification
