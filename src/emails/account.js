const sgMail = require("@sendgrid/mail");
const { send } = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "akhilsiraswal@gmail.com",
    subject: "Thanks for joining in",
    text: `Welcome to the app,${name}. Let me know how you get along with the app`,
  });
};

const sendCancelationEmail = (email, name) => {
  console.log("email sending ");
  sgMail.send({
    to: email,
    from: "akhilsiraswal@gmail.com",
    subject:
      "Thanks for deleting you account we don't need you fucking bastards... ",
    text: ` you fucking ${name} looser get lost from here and never come back to my company.... `,
  });
  console.log("email send");
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
