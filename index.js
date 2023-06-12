const express = require("express");
require("dotenv").config();
const { connectDB } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { postRouter } = require("./routes/post.routes");

const app = express();
app.use(express.json());

app.use("/users", userRouter);
app.use("/posts", postRouter);

connectDB().then(() => {
  app.listen(process.env.port, async () => {
    try {
      console.log(`connected to server port ${process.env.port}`);
    } catch (error) {
      console.log(error);
      console.log("something went wrong");
    }
  });
});
