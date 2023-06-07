const app = require("./app");

const mongoose = require("mongoose");

const  DB_HOST  = "mongodb+srv://artemka:6FJMXYvxQTIYMnqe@cluster0.i77wzwj.mongodb.net"

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });