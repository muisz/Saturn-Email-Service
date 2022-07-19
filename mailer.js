const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

transporter.verify((error, success) => {
    if(error) {
        console.log(`can't connect to smtp server`);
        console.log(error);
    } else {
        console.log("smtp server connected");
    }
});

module.exports = transporter;