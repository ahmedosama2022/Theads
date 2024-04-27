const cors = require('cors')
const express = require("express")
const cookieParser = require( "cookie-parser");
const dotenv = require('dotenv');
const userRouter = require ('./routes/user.route.js');
const authRouter = require ('./routes/auth.route.js');
const listingRouter = require ('./routes/listing.route.js');
const mongoose = require("mongoose");
dotenv.config();


const app = express();


mongoose
  .connect("mongodb+srv://ahmedosamana222:P2nkIZRPezUIefpv@cluster0.klcach9.mongodb.net/")
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

 

app.use(express.json());

app.use(cookieParser());

app.listen(6000, () => {
  console.log('Server is running on port 6000!');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);



app.use(express.json());
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
