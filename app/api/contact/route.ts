import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate the input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Format the date for the email
    const formattedDate = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Create a more specific subject line
    const emailSubject = `New Contact: ${subject} from ${name}`;

    // Email content with improved structure
    const mailOptions = {
      from: {
        name: 'Widget Support',
        address: process.env.EMAIL_USER || ''
      },
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER || '',
      replyTo: email,
      subject: emailSubject,
      text: `
New contact form submission received on ${formattedDate}

FROM: ${name} (${email})
SUBJECT: ${subject}

MESSAGE:
${message}

---
This email was sent from your website contact form. To reply to the sender, simply reply to this email.
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Widget Support/Suggestion Ticket</title>
  <style>
    body { font-family: Arial; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background-color: #f5f5f5; padding: 20px; border-bottom: 3px solid #0B9D52; }
    .content { padding: 20px; }
    .footer { font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px; }
    h1 { color: #0B9D52; margin: 0; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; }
    .message-box { background-color: #f9f9f9; padding: 15px; border-left: 3px solid #0B9D52; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Widget Support/Suggestion Ticket</h1>
    <p>Received on ${formattedDate}</p>
  </div>
  
  <div class="content">
    <div class="field">
      <span class="label">Name:</span> ${name}
    </div>
    
    <div class="field">
      <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
    </div>
    
    <div class="field">
      <span class="label">Subject:</span> ${subject}
    </div>
    
    <div class="field">
      <span class="label">Message:</span>
      <div class="message-box">
        ${message.replace(/\n/g, '<br>')}
      </div>
    </div>
  </div>
  
  <div class="footer">
    <p>This email was sent from your website contact form. To reply to the sender, simply reply to this email.</p>
  </div>
</body>
</html>
      `,
      headers: {
        'X-Entity-Ref-ID': `contact-form-${Date.now()}`, // Unique ID to prevent duplicate detection
        'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=Unsubscribe>` // Proper unsubscribe header
      }
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 