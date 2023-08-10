const OrderTable = require("../models/OrderDetails");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const moment = require("moment");
const ProductDetails = require('../models/ProductDetails')
const OrderTransaction = require('../models/OrderTransaction')
const ejs = require('ejs');
const path = require('path');

const timeZone = 'Asia/Kolkata';
// Schedule the function to run every day at midnight (0 0 * * *)
cron.schedule("*/1 * * * *", async () => {
    try {
        await sendEmailsToUsers();
        console.log("Scheduled job completed.");
    } catch (err) {
        console.log("Error executing scheduled job:", err);
    }
}, {
    timezone: timeZone
});


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "nirali.evince@gmail.com",
        pass: "qaspbrvjqdsowvwz",
    },
});

// async function sendEmailsToUsers() {
//     try {


//         const orderRows = await OrderTable.findAll(); // Fetch all rows from the OrderTable

//         for (const orderRow of orderRows) {
//             const email = orderRow.User_email;

//             const transactionDetails = await OrderTransaction.findAll({
//                 where: { payment_status: "pending", orderId: orderRow.id }
//             });

//             if (transactionDetails.length > 0) {
//                 const productDetails = await ProductDetails.findOne({ where: { orderId: orderRow.id } });

//                 const htmlProductDetails = `
//                     <table>
//                     <thead>
//                         <tr>
//                             <th>Product Name</th>
//                             <th>Price</th>
//                             <th>Quantity</th>
//                             <!-- Add more table headers if needed -->
//                         </tr>

//                     </thead>
//                     <tbody>
//                         <tr>
//                             <td>${productDetails.ProductName}</td>
//                             <td>${productDetails.Price}</td>
//                             <td>${productDetails.Quantity}</td>

//                         </tr>
//                     </tbody>
//                 </table>`;

//                 const mailOptions = {
//                     from: "nirali.evince@gmail.com",
//                     to: email,
//                     subject: "Subject of the Email",
//                     html: `  <p>Dear User,</p>
//                     <p> We wanted to remind you about your pending list of items:</p>
//                     ${htmlProductDetails}
//                     <p>For any inquiries, please contact us.</p>`,
//                 };
//                 const info = await transporter.sendMail(mailOptions);
//                 console.log(`Email sent to ${email}:`, info.response);

//                 // Format the current date in the desired format
//                 const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

//                 // Update SendAt with the formatted date
//                 await OrderTable.update({ SendAt: currentDate }, { where: { id: orderRow.id } });
//                 // await OrderTable.update({ SendAt: new Date() }, { where: { id: orderRow.id } });
//             }
//         }
//     } catch (error) {
//         console.log("Error sending emails:", error);

//     }
// }
async function sendReminderEmail(email, productDetails) {
    const renderedTemplate = await ejs.renderFile(path.join(__dirname, '../views', 'emailtemplate.ejs'), {
        products: [productDetails],
    });



    const mailOptions = {
        from: "nirali.evince@gmail.com",
        to: email,
        subject: "Subject of the Email",
        html: renderedTemplate,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}:`, info.response);
    } catch (error) {
        console.log(`Error sending email to ${email}:`, error);
    }
}


async function sendEmailsToUsers() {
    try {


        const orderRows = await OrderTable.findAll();

        for (const orderRow of orderRows) {
            const email = orderRow.User_email;

            const transactionDetails = await OrderTransaction.findAll({
                where: { payment_status: "pending", orderId: orderRow.id }
            });

            if (transactionDetails.length > 0) {
                const productDetails = await ProductDetails.findOne({ where: { orderId: orderRow.id } });
                await sendReminderEmail(email, productDetails);


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