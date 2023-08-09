const OrderTable = require("../models/OrderDetails");
const nodemailer = require("nodemailer");
const fs = require("fs");
const cron = require("node-cron");
const moment = require("moment");
const ProductDetails = require('../models/ProductDetails')
const OrderTransaction = require('../models/OrderTransaction')
// async function sendpendingordersdetails(email) {
//     try {
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: "nirali.evince@gmail.com",
//                 pass: "qaspbrvjqdsowvwz",
//             },
//         });
//         const mailOptions = {
//             from: "nirali.evince@gmail.com",
//             to: email,
//             subject: "Reset Your Password",
//             html: `<p>Click the link below </p>`

//         };
//         const info = await transporter.sendMail(mailOptions);
//         console.log("Email sent:", info.response);
//     }
//     catch (error) {
//         console.log("Error sending order", error)
//     }
// }




// async function sendEmailsToUsers() {
//     try {
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: "nirali.evince@gmail.com",
//                 pass: "qaspbrvjqdsowvwz",
//             },
//         });


//         const orderRows = await OrderTable.findAll(); // Fetch all rows from the OrderTable

//         for (const orderRow of orderRows) {
//             const email = orderRow.User_email;
//             const transactionDetails = await OrderTransaction.findAll({ where: { payment_status: "pending", orderId: orderRow.id } })
//             console.log(transactionDetails);
//             console.log(transactionDetails.length);
//             let htmlProductDetails = '';
//             if (transactionDetails.length > 0) {
//                 const productDetails = await ProductDetails.findOne({ where: { orderId: orderRow.id } });

//                 const htmlProductDetails = `
//             <table>
//             <thead>
//                 <tr>
//                     <th>Product Name</th>
//                     <th>Price</th>
//                     <th>Quantity</th>
//                     <!-- Add more table headers if needed -->
//                 </tr>
//             </thead>
//             <tbody>
//                 <tr>
//                     <td>${productDetails.ProductName}</td>
//                     <td>${productDetails.Price}</td>
//                     <td>${productDetails.Quantity}</td>
//                     <!-- Add more table data cells if needed -->
//                 </tr>
//             </tbody>
//         </table>

//         `;
//             }

//             const mailOptions = {
//                 from: "nirali.evince@gmail.com",
//                 to: email,
//                 subject: "Subject of the Email",
//                 html: `  <p>Dear User,</p>
//                 <p> We wanted to remind you about your pending list of items:</p>
//                 ${htmlProductDetails}
//                 <p>For any inquiries, please contact us.</p>`,
//             };
//             const info = await transporter.sendMail(mailOptions);
//             console.log(`Email sent to ${email}:`, info.response);
//         }
//     } catch (error) {
//         console.log("Error sending emails:", error);
//     }
// }


// ... (other imports and code)

// Schedule the function to run every day at midnight (0 0 * * *)
cron.schedule("*/1 * * * *", async () => {
    try {
        await sendEmailsToUsers();
        console.log("Scheduled job completed.");
    } catch (err) {
        console.log("Error executing scheduled job:", err);
    }
});

async function sendEmailsToUsers() {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "nirali.evince@gmail.com",
                pass: "qaspbrvjqdsowvwz",
            },
        });

        const orderRows = await OrderTable.findAll(); // Fetch all rows from the OrderTable

        for (const orderRow of orderRows) {
            const email = orderRow.User_email;

            const transactionDetails = await OrderTransaction.findAll({
                where: { payment_status: "pending", orderId: orderRow.id }
            });

            if (transactionDetails.length > 0) {
                const productDetails = await ProductDetails.findOne({ where: { orderId: orderRow.id } });

                const htmlProductDetails = `
                    <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <!-- Add more table headers if needed -->
                        </tr>

                    </thead>
                    <tbody>
                        <tr>
                            <td>${productDetails.ProductName}</td>
                            <td>${productDetails.Price}</td>
                            <td>${productDetails.Quantity}</td>
                           
                        </tr>
                    </tbody>
                </table>`;

                const mailOptions = {
                    from: "nirali.evince@gmail.com",
                    to: email,
                    subject: "Subject of the Email",
                    html: `  <p>Dear User,</p>
                    <p> We wanted to remind you about your pending list of items:</p>
                    ${htmlProductDetails}
                    <p>For any inquiries, please contact us.</p>`,
                };
                const info = await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${email}:`, info.response);
                // const currentDate = new Date().toISOString(); // Convert Date to ISO string
                // await OrderTable.update({ SendAt: currentDate }, { where: { id: orderRow.id } });
                // Format the current date in the desired format
                const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

                // Update SendAt with the formatted date
                await OrderTable.update({ SendAt: currentDate }, { where: { id: orderRow.id } });
                // await OrderTable.update({ SendAt: new Date() }, { where: { id: orderRow.id } });
            }
        }
    } catch (error) {
        console.log("Error sending emails:", error);

    }
}





exports.createOrderDetails = async (req, res) => {


    try {


        await sendEmailsToUsers();
        res.status(200).send("Emails sent successfully");

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}