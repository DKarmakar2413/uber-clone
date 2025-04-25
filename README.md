# User Registration Endpoint Documentation

## Endpoint

**POST** `/users/register`

## Description

This endpoint registers a new user. It:

- Validates the input data using `express-validator` middleware ([routes/user.routes.js](backend/routes/user.routes.js)).
- Hashes the password using the method in [models/user_models.js](backend/models/user_models.js).
- Creates a new user with [services/user.service.js](backend/services/user.service.js) and saves it to MongoDB.
- Generates a JWT token for the newly registered user ([controller/user.controller.js](backend/controller/user.controller.js)).

## Request Data Requirements

The endpoint expects a JSON request body with the following structure:

```json
{
  "fullname": {
    "firstname": "string, required, minimum 3 characters",
    "lastname": "string, optional, minimum 3 characters"
  },
  "email": "string, required, must be a valid email",
  "password": "string, required, minimum 6 characters"
}
```

# User Login Endpoint Documentation

## Endpoint

**POST** `/users/login`

## Description

This endpoint authenticates an existing user. It:

- Validates the input data using `express-validator` middleware ([routes/user.routes.js](backend/routes/user.routes.js))
- Checks if user exists with the provided email
- Verifies the password using bcrypt comparison
- Generates a JWT token for authenticated sessions

## Request Data Requirements

The endpoint expects a JSON request body with the following structure:

```json
{
  "email": "string, required, must be a valid email",
  "password": "string, required, minimum 6 characters"
}
```

## Response Status Codes

- **200 OK:**  
  Successful login with user details and JWT token

- **401 Unauthorized:**  
  Invalid email or password

- **422 Unprocessable Entity:**  
  Validation errors (invalid email format or password length)

## Example Request

```json
POST /users/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

## Example Response (Success)

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

## Example Response (Error)

```json
{
  "status": "fail",
  "message": "Invalid email or password"
}
```

# User Profile Endpoint Documentation

## Endpoint

**GET** `/users/profile`

## Description

This endpoint retrieves the authenticated user's profile. It:

- Verifies the JWT token from cookies or Authorization header
- Uses the auth middleware to validate the user's session
- Returns the user's profile information

## Authentication

Requires a valid JWT token either:
- In the cookies as `token`
- In Authorization header as `Bearer <token>`

## Response Status Codes

- **200 OK:**  
  Successfully retrieved user profile

- **401 Unauthorized:**  
  Invalid or missing token, or blacklisted token

## Example Request

```bash
GET /users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Example Response (Success)

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
}
```

# User Logout Endpoint Documentation

## Endpoint

**GET** `/users/logout`

## Description

This endpoint logs out the current user. It:

- Clears the token cookie
- Adds the current token to blacklist to prevent reuse
- Requires authentication to ensure only logged-in users can logout

## Authentication

Requires a valid JWT token either:
- In the cookies as `token`
- In Authorization header as `Bearer <token>`

## Response Status Codes

- **200 OK:**  
  Successfully logged out

- **401 Unauthorized:**  
  Invalid or missing token

## Example Request

```bash
GET /users/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Example Response (Success)

```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

## Example Response (Error)

```json
{
  "message": "Unauthorized"
}
```

# Captain Registration Endpoint Documentation

## Endpoint

**POST** `/captains/register`

## Description

This endpoint registers a new captain (driver) with their vehicle information. It:

- Validates the input data using `express-validator` middleware
- Checks for existing email to prevent duplicates
- Hashes the password using bcrypt
- Creates a new captain profile with vehicle details
- Generates a JWT token for authentication

## Request Data Requirements

The endpoint expects a JSON request body with the following structure:

```json
{
  "fullname": {
    "firstname": "string, required, minimum 3 characters",
    "lastname": "string, optional, minimum 3 characters"
  },
  "email": "string, required, must be a valid email",
  "password": "string, required, minimum 6 characters",
  "vehicle": {
    "vehicleType": "enum: car, motorcycle, or auto",
    "color": "string, required",
    "plateNumber": "string, required",
    "capacity": "number, required, minimum 1"
  },
  "location": {
    "latitude": "number, optional, range: -90 to 90",
    "longitude": "number, optional, range: -180 to 180"
  },
  "status": "enum: active or inactive, default: inactive"
}
```

## Validation Rules

- **Email**: Must be unique and in valid email format
- **First Name**: Minimum 3 characters
- **Password**: Minimum 6 characters
- **Vehicle Type**: Must be one of: "car", "motorcycle", "auto"
- **Vehicle Capacity**: Must be a positive integer
- **Location Coordinates**: Must be valid latitude/longitude values (if provided)

## Response Status Codes

- **201 Created:**  
  Successfully registered captain

- **409 Conflict:**  
  Email already exists

- **422 Unprocessable Entity:**  
  Validation errors

## Example Request

```json
POST /captains/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.driver@example.com",
  "password": "securepass123",
  "vehicle": {
    "vehicleType": "car",
    "color": "black",
    "plateNumber": "ABC123",
    "capacity": 4
  }
}
```

## Example Response (Success)

```json
{
  "status": "success",
  "data": {
    "captain": {
      "_id": "507f1f77bcf86cd799439011",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.driver@example.com",
      "status": "inactive",
      "vehicle": {
        "vehicleType": "car",
        "color": "black",
        "plateNumber": "ABC123",
        "capacity": 4
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Example Response (Error)

```json
{
  "status": "fail",
  "message": "Captain with this email already exists"
}
```

OR

```json
{
  "errors": [
    {
      "msg": "Vehicle type must be either car, motorcycle, or auto",
      "param": "vehicle.vehicleType",
      "location": "body"
    }
  ]
}
```
