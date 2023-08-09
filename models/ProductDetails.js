const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
    "ecom_react",
    "root",
    "qwer?<>rewq567",
    {
        host: "localhost",
        dialect: "mysql",
    }
);

const ProductDetails = sequelize.define(
    "ProductDetails",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        orderId: Sequelize.STRING,
        ProductName: Sequelize.STRING,
        Quantity: Sequelize.INTEGER,
        Price: Sequelize.INTEGER,



    },
    {
        tableName: "ProductDetails",

    }
);

module.exports = ProductDetails;