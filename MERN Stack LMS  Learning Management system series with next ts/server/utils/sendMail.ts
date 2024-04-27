import nodemailer,{Transporter} from "nodemailer";
import path from "path";
import ejs from "ejs";

interface EmailOptions{
    email:string;
    subject:string;
    template:string;
    data: {[key:string]:any};
}

const sendMail = async (options: EmailOptions):Promise <void> => {
   const transporter : Transporter = nodemailer.createTransport({
   host: process.env.SMTP_HOST,
   port: process.env.SMTP_PORT,
   service: process.env.SMTP_SERVICE,
   auth:{
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
   },
   });


   const {email,subject,template,data} = options;



   // get the pdath to the email template file

   const templatepath = path.join(__dirname, '../mails', template)

   const html:string = await ejs.renderFile(templatepath,data)

   // send the email

   const mailOptions = ({
    from: process.env.SMTP_MAIL,
    to:email,
    subject,
    html,
   });

   await transporter.sendMail(mailOptions)
}

export default sendMail