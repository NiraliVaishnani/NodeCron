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

const OrderTable = sequelize.define(
    "OrderTable",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        User_email: Sequelize.STRING,
        SendAt: Sequelize.STRING,



    },
    {
        tableName: "OrderTable",

    }
);

module.exports = OrderTable;