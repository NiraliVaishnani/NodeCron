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

const OrderTransaction = sequelize.define(
    "OrderTransaction",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        payment_status: {
            type: DataTypes.STRING, // Use STRING data type for payment status

        },
        orderId: Sequelize.INTEGER,



    },
    {
        tableName: "OrderTransaction",

    }
);
OrderTransaction.sequelize.sync()

module.exports = OrderTransaction;