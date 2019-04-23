# Todo API

Basic API for todo list. This application is a side-effect of learning node.js and express.js.

## Prerequisites

To run app on your local machine you will need:

-   [Node.js](https://nodejs.org)
-   [Mongo DB](https://www.mongodb.com/)

## Installation

Install NPM packages:

```
npm install
```

## Usage

Prepare a config file on path `server/config/config.json` like this:

```
{
    "test": {
        "PORT": 3000,
        "MONGODB_URI": "mongodb://localhost:27017/TodoAppTest",
        "JWT_SECRET": "123456"
    },
    "development": {
        "PORT": 3000,
        "MONGODB_URI": "mongodb://localhost:27017/TodoApp",
        "JWT_SECRET": "abcdef"
    }
}

```

-   `PORT` - define on which port would you like to serve the app
-   `MONDODB_URI` - define URI of your mongo database instance
-   `JWT_SECRET` - define salt key for JWT hashing purposes

To run app locally run:

```
npm run dev
```
