# Trip Planner API

## Overview
The Trip Planner API is a Node.js application built with TypeScript that provides endpoints for user registration and login. It utilizes MySQL as the database to store user information.

## Project Structure
```
trip-planner-api
├── src
│   ├── controllers
│   │   ├── authController.ts
│   ├── routes
│   │   ├── authRoutes.ts
│   ├── models
│   │   ├── user.ts
│   ├── services
│   │   ├── authService.ts
│   ├── config
│   │   ├── db.ts
│   ├── app.ts
│   └── server.ts
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd trip-planner-api
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Configuration
Create a `.env` file in the root directory and add your database connection details:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=trip_planner
```

## Running the Application
To start the server, run:
```
npm start
```

## API Endpoints

### Registration
- **Endpoint:** `POST /api/auth/register`
- **Description:** Registers a new user with email or device ID.
- **Request Body:**
  - `email`: string (optional if deviceId is provided)
  - `deviceId`: string (optional if email is provided)
  - `password`: string

### Login
- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticates a user with email/device ID and password.
- **Request Body:**
  - `email`: string (optional if deviceId is provided)
  - `deviceId`: string (optional if email is provided)
  - `password`: string

## Usage
After starting the server, you can test the API endpoints using tools like Postman or curl.

## License
This project is licensed under the MIT License.