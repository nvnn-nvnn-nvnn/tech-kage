const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text, html) => {
  try {
    const data = await resend.emails.send({
      from: 'TechKage <orders@techkage.com>',
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent:', data.id);
    return { success: true, id: data.id };
  } catch (err) {
    console.error('Email error:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = { sendEmail };