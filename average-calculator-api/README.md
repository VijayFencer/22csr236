# Average Calculator API

This project implements a simple Node.js backend API that calculates the average of an array of numbers. The API is built using Express and does not rely on any external libraries for the average calculation algorithm.

## Project Structure

```
average-calculator-api
├── src
│   ├── app.js
│   ├── controllers
│   │   └── averageController.js
│   ├── routes
│   │   └── averageRoutes.js
│   └── utils
│       └── calculateAverage.js
├── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```
   cd average-calculator-api
   ```

3. Install the dependencies:

   ```
   npm install
   ```

### Running the Application

To start the server, run the following command:

```
node src/app.js
```

The server will start on `http://localhost:3000`.

### API Endpoint

- **POST /average**

  This endpoint accepts a JSON body containing an array of numbers and returns the average.

  **Request Body Example:**
  ```json
  {
    "numbers": [10, 20, 30, 40]
  }
  ```

  **Response Example:**
  ```json
  {
    "average": 25
  }
  ```

### Testing the API

You can test the API using tools like Postman or Insomnia. Make sure to set the request type to POST and include the appropriate JSON body.

### Response Time

The response time for the API calls will vary based on the input size and server performance. You can monitor the response time in your API client.

## License

This project is licensed under the MIT License.