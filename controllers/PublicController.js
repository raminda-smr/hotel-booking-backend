import dotenv from 'dotenv'
import nodemailer from "nodemailer"

dotenv.config()

export function sendContactMail(req, res) {
    const { name, subject, email, phone, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required fields." });
    }

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Email to admin
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ADMIN, // Admin email
        subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
    };

    // Email to user
    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email, // User's email
        subject: "Thank you for contacting us",
        html: `
            <h2>Thank you for reaching out!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for contacting us. We have received your message and will get back to you as soon as possible.</p>
            <p><strong>Your Message:</strong></p>
            <p>${message}</p>
            <p>Best regards,</p>
            <p>The Team</p>
        `,
    };

    // Send emails to both admin and user
    Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(userMailOptions),
    ])
        .then(() => {
            console.log("Emails sent to both admin and user.");
            res.status(200).json({ message: "Contact form submitted successfully." });
        })
        .catch((error) => {
            console.error("Error sending emails:", error);
            res.status(500).json({ error: "Failed to send emails. Please try again later." });
        });
}