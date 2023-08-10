const express = require('express');
const app = express();
const { Sequelize } = require('sequelize');
const ProductDetails = require('./models/ProductDetails')
const OrderTable = require('./models/OrderDetails')
const OrderTransaction = require('./models/OrderTransaction')

const sequelize = new Sequelize(
    "ecom_react",
    "root",
    "qwer?<>rewq567",
    {
        host: "localhost",
        dialect: "mysql",
    }
);

// Test the connection
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });
sequelize.sync()
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((error) => {
        console.error('Error synchronizing database:', error);
    });


const orderdetails = require("./routes/OrderDetails");

app.use("/api", orderdetails);
app.listen(3000);