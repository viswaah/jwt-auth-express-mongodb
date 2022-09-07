import nodemailer from "nodemailer";

const sendEmail = async (email: string, subject: string, message: string) => {
  try {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    let info = await transporter.sendMail({
      from: '"Jwt Tut" <foo@jwttut.com>', // sender address
      to: email, // list of receivers
      subject, // Subject line
      html: message, // html body
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return true;
  } catch (err) {
    console.error("send email error: " + err);
    return false;
  }
};

export { sendEmail };
