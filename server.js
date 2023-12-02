const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const port = 3000;
const app = express();
const cors = require("cors");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const whqRouter = require("./routes/whq");

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

//For Axios Network Error
app.use(cors());

//To allow localhost network
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// app.use(
//   session({
//     secret: "my secret key",
//     saveUninitialized: true,
//     resave: false,
//   })
// );

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/", authRouter);
app.use("/api/users", userRouter);
app.use("/api/whq", whqRouter);

function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "karthik.digitaltechworks@gmail.com",
        pass: "vldnuqxtygphrnor", //password created from - google accounts > security > turn on 2step auth > App passwords
      },
    });

    const emailOptions = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "Ideabox Password Recovery",
      html: `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>Ideabox - OTP Email Verification</title>
  

</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Ideabox</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing Ideabox. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />Ideabox</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Ideabox Inc</p>
      <p>KSA</p>
    </div>
  </div>
</div>
<!-- partial -->
  
</body>
</html>`,
    };
    transporter.sendMail(emailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}

app.get("/", (req, res) => {
  console.log(process.env.MY_EMAIL);
});

app.post("/send_recovery_email", (req, res) => {
  sendEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.listen(process.env.PORT || port, () =>
  console.log(`IdeaBox Node backend listening on port ${process.env.PORT}!`)
);
