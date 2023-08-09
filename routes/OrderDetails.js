const express = require("express");
const router = express.Router();
const orderdetails = require("../controllers/OrderDetails");

// router.get("/orderdetails", orderdetails.getOrderDetails);
router.post("/orderdetails", orderdetails.createOrderDetails);


module.exports = router;