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
