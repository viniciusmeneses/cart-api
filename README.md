<h1 align="center">
  Cart API
</h1>

<h4 align="center">
  Shopping cart API developed with Node.js
</h4>

<p align="center">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/viniciusmeneses/cart-api">
  
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/viniciusmeneses/cart-api">
    
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/viniciusmeneses/cart-api">

  <img alt="Coverage" src="./badges/badge-lines.svg">
</p>

## 🛒 Project

REST API that implements the shopping cart behaviors. This project was developed using the stack Typescript + Node.js + PostgreSQL stack and applying the Clean Architecture concepts and SOLID principles.

## 💡 Requirements

- [x] Save cart data
- [x] Get cart data
- [x] Add an item to cart
- [x] Remove an item from cart
- [x] Update the quantity of a cart item
- [x] Clear cart items
- [x] Apply a discount coupon to cart 

## 🎲 Running

In order to run the API in development environment, you must have at least the following tools installed: [Git](https://git-scm.com), [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/).

```bash
# Clone repository
$ git clone git@github.com:viniciusmeneses/cart-api.git

# Go to project directory
$ cd cart-api

# Make a copy of envs configuration file
$ cp .env.sample .env

# Create database and start the server
$ docker-compose up -d

# Run database migrations
$ docker exec -t cart-api yarn migration:run
```

The API will be served on port 3000 by default and it can be accessed by URL http://localhost:3000.

## 📄 Docs

Every endpoint and your returns were documented using Swagger and can be accessed by the path `/docs`.

#### Test data

The following data will be inserted into the database when you run the migrations. It can be used when doing requests to endpoints that need an existing product or coupon.

```js
// Products
{ id: "779d7f21-05b7-4a74-82e5-68b43c7d42d4", name: "T-shirt", price: 45.0, stock: 10 }
{ id: "a5d66c1a-b540-45ec-aab7-1e7dc932c38f", name: "Pants", price: 90.0, stock: 10 }
{ id: "c2f6dd0e-763e-4600-ad6f-0699be6ba5ae", name: "Sneakers", price: 199.99, stock: 3 }
{ id: "c98b3118-677d-4aec-9b06-d20f0015a5ac", name: "Sweatshirt", price: 149.99, stock: 5 }
{ id: "9450ea85-ab39-4d06-ae9f-8cd7f20ed4e6", name: "Cap", price: 20.0, stock: 4 }

// Discount coupons
{ id: "f99458a3-918e-4275-83bc-f62d5a891480", code: "GHW2O", percentage: 10.0 }
{ id: "695ba12a-7b9d-4c5d-8d70-649583590a34", code: "VEFJY", percentage: 5.0 }
{ id: "c4a9f80d-8ecc-4870-82f1-c436ac18581f", code: "D0JNN", percentage: 2.5 }
```
