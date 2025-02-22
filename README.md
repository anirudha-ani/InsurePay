# InsurePay

InsurePay is a backend application that manages insurance policies and finance terms for users. It uses Node.js, Express, and PostgreSQL/SQLite to provide a RESTful API for creating, reading, updating, and deleting users, insurance plans, insurance policies, and finance terms. Sequelize is used as the ORM for the database.

This documentation provides an overview of the available APIs for managing users, insurance plans, insurance policies, and finance terms.

## Table of Contents

- [Running the Backend](#running-the-backend)
- [User API](#user-api)
- [Insurance Plan API](#insurance-plan-api)
- [Insurance Policy API](#insurance-policy-api)
- [Finance Terms API](#finance-terms-api)

## Running the Backend

To run the backend server, you need to have Node.js installed on your machine. 

```bash
npm install
```
After that you need to setup the database by running the following command. Either you can setup a postgresql database using this official documentation - https://www.postgresql.org/ or you can use the in-memory SQLite database. 

In either case, you need to update the configuration in the `apps/backend/src/config/database.ts` file. By default the test database is set to use SQLite and development database is set to use PostgreSQL.

You can start the server by running the following commands:

```bash
nx serve backend
```

By default the server will run on  http://localhost:3000

## Running the Tests

To run the tests, you can use the following command:

```bash
NODE_ENV=test DB_DIALECT=sqlite npx jest
```

## User API

### DataModel 

You can see the excalidraw diagram of the data model in the by importing `InsurePay Dataodel.excalidraw` file from root folder in https://excalidraw.com/

![Untitled-2024-12-04-1110](https://github.com/user-attachments/assets/c16b0996-3f37-4a8e-a1bb-4299e913457a)



### Postman
You can import the postman collection from `InsurePay.postman_collection.json` file from root folder to test the APIs.

### Create a New User

- **Endpoint:** `POST /users`
- **Description:** Creates a new user.
- **Request Body:**
  ```json
  {
    "username": "string"
  }
  ```
- **Response:**
  - **201 Created**
    ```json
    {
      "id": "number",
      "username": "string"
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "Username already exists"
    }
    ```

### Get All Users

- **Endpoint:** `GET /users`
- **Description:** Retrieves a list of all users.
- **Response:**
  - **200 OK**
    ```json
    [
      {
        "id": "number",
        "username": "string"
      }
    ]
    ```

### Update a User

- **Endpoint:** `PUT /users/:id`
- **Description:** Updates an existing user.
- **Request Body:**
  ```json
  {
    "username": "string"
  }
  ```
- **Response:**
  - **200 OK**
    ```json
    {
      "id": "number",
      "username": "string"
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "Username already exists"
    }
    ```

### Delete a User

- **Endpoint:** `DELETE /users/:id`
- **Description:** Deletes a user.
- **Response:**
  - **204 No Content**
  - **404 Not Found**
    ```json
    {
      "error": "User not found"
    }
    ```

## Insurance Plan API

### Create a New Insurance Plan

- **Endpoint:** `POST /insurance-plans`
- **Description:** Creates a new insurance plan.
- **Request Body:**
  ```json
  {
    "premium": "number",
    "taxFee": "number"
  }
  ```
- **Response:**
  - **201 Created**
    ```json
    {
      "id": "number",
      "premium": "number",
      "taxFee": "number"
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "Premium and tax fee must be non-negative"
    }
    ```

### Get All Insurance Plans

- **Endpoint:** `GET /insurance-plans`
- **Description:** Retrieves a list of all insurance plans.
- **Response:**
  - **200 OK**
    ```json
    [
      {
        "id": "number",
        "premium": "number",
        "taxFee": "number"
      }
    ]
    ```

### Get an Insurance Plan by ID

- **Endpoint:** `GET /insurance-plans/:id`
- **Description:** Retrieves an insurance plan by its ID.
- **Response:**
  - **200 OK**
    ```json
    {
      "id": "number",
      "premium": "number",
      "taxFee": "number"
    }
    ```

### Update an Insurance Plan

- **Endpoint:** `PUT /insurance-plans/:id`
- **Description:** Updates an existing insurance plan.
- **Request Body:**
  ```json
  {
    "premium": "number",
    "taxFee": "number"
  }
  ```
- **Response:**
  - **200 OK**
    ```json
    {
      "id": "number",
      "premium": "number",
      "taxFee": "number"
    }
    ```

### Delete an Insurance Plan

- **Endpoint:** `DELETE /insurance-plans/:id`
- **Description:** Deletes an insurance plan.
- **Response:**
  - **204 No Content**

## Insurance Policy API

### Create a New Insurance Policy

- **Endpoint:** `POST /insurance-policies`
- **Description:** Creates a new insurance policy.
- **Request Body:**
  ```json
  {
    "userId": "number",
    "insurancePlanId": "number"
  }
  ```
- **Response:**
  - **201 Created**
    ```json
    {
      "id": "number",
      "userId": "number",
      "insurancePlanId": "number"
    }
    ```
  - **404 Not Found**
    ```json
    {
      "error": "User or Insurance Plan not found"
    }
    ```

### Get All Insurance Policies

- **Endpoint:** `GET /insurance-policies`
- **Description:** Retrieves a list of all insurance policies.
- **Response:**
  - **200 OK**
    ```json
    [
      {
        "id": "number",
        "userId": "number",
        "insurancePlanId": "number"
      }
    ]
    ```

### Get an Insurance Policy by ID

- **Endpoint:** `GET /insurance-policies/:id`
- **Description:** Retrieves an insurance policy by its ID.
- **Response:**
  - **200 OK**
    ```json
    {
      "id": "number",
      "userId": "number",
      "insurancePlanId": "number"
    }
    ```

### Update an Insurance Policy

- **Endpoint:** `PUT /insurance-policies/:id`
- **Description:** Updates an existing insurance policy.
- **Request Body:**
  ```json
  {
    "userId": "number",
    "insurancePlanId": "number"
  }
  ```
- **Response:**
  - **200 OK**
    ```json
    {
      "id": "number",
      "userId": "number",
      "insurancePlanId": "number"
    }
    ```

### Delete an Insurance Policy

- **Endpoint:** `DELETE /insurance-policies/:id`
- **Description:** Deletes an insurance policy.
- **Response:**
  - **204 No Content**

## Finance Terms API

### Create a New Finance Terms

- **Endpoint:** `POST /finance-terms`
- **Description:** Creates a new finance terms.
- **Request Body:**
  ```json
  {
    "insurancePolicyIDs": ["number"],
    "dueDate": "date",
    "createdBy": "number"
  }
  ```
- **Response:**
  - **201 Created**
    ```json
    {
      "id": "number",
      "dueDate": "date",
      "createdBy": "number",
      "status": "non-agreed",
      "insurancePolicyIDs": ["number"]
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "Due date must be in the future"
    }
    ```

### Agree to Finance Terms

- **Endpoint:** `PUT /finance-terms/:id/agree`
- **Description:** Agrees to finance terms.
- **Request Body:**
  ```json
  {
    "agreedBy": "number"
  }
  ```
- **Response:**
  - **200 OK**
    ```json
    {
      "id": "number",
      "dueDate": "date",
      "createdBy": "number",
      "agreedBy": "number",
      "status": "agreed",
      "insurancePolicyIDs": ["number"]
    }
    ```

### List All Finance Terms

- **Endpoint:** `GET /finance-terms`
- **Description:** Retrieves a list of all finance terms.
- **Response:**
  - **200 OK**
    ```json
    [
      {
        "id": "number",
        "dueDate": "date",
        "createdBy": "number",
        "status": "string",
        "insurancePolicyIDs": ["number"]
      }
    ]
    ```

### Get Finance Terms by ID

- **Endpoint:** `GET /finance-terms/:id`
- **Description:** Retrieves finance terms by its ID.
- **Response:**
  - **200 OK**
    ```json
    {
      "id": "number",
      "dueDate": "date",
      "createdBy": "number",
      "status": "string",
      "insurancePolicyIDs": ["number"]
    }
    ```

### Update Finance Terms

- **Endpoint:** `PUT /finance-terms/:id`
- **Description:** Updates existing finance terms.
- **Request Body:**
  ```json
  {
    "dueDate": "date",
    "status": "string",
    "agreedBy": "number",
    "insurancePolicyIDs": ["number"]
  }
  ```
- **Response:**
  - **200 OK**
    ```json
    {
      "id": "number",
      "dueDate": "date",
      "createdBy": "number",
      "status": "string",
      "agreedBy": "number",
      "insurancePolicyIDs": ["number"]
    }
    ```

### Delete Finance Terms

- **Endpoint:** `DELETE /finance-terms/:id`
- **Description:** Deletes finance terms.
- **Response:**
  - **204 No Content**

### Filter and Sort Finance Terms

- **Endpoint:** `GET /finance-terms`
- **Description:** Retrieves a list of finance terms with optional filters and sorting.
- **Query Parameters:**
  - `status`: Filter by status (e.g., `agreed`, `non-agreed`).
  - `sortBy`: Sort by a specific field (e.g., `dueDate`).
  - `order`: Sort order (e.g., `ASC`, `DESC`).
  - `downPaymentFilter`: Filter by down payment amount (`greater`, `less`, `equal`).
  - `downPaymentAmount`: The amount to filter by.
- **Response:**
  - **200 OK**
    ```json
    [
      {
        "id": "number",
        "dueDate": "date",
        "createdBy": "number",
        "status": "string",
        "insurancePolicyIDs": ["number"]
      }
    ]
    ```

## License
None

