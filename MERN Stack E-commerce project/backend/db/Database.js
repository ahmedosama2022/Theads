const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect("mongodb+srv://ahmedosamana222:Gmpe4ZTa7R4yb9Rp@cluster5.4s28qng.mongodb.net/?retryWrites=true&w=majority", {

    })
    .then((data) => {
      console.log(`mongod connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;
