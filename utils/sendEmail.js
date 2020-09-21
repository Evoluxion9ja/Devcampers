const nodemailer = require('nodemailer');

const sendEmail = async (options) =>
{
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        },
    })

    const message = await transporter.sendMail({
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.text,
        html: options.html
    })

    const info = await transporter.sendMail(message);

    console.log(`Message Sent Successfully: %s`, info.messageId);
}

module.exports = sendEmail;