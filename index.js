const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");
const blogRouter = require("./routes/blogRouter");
const connection = require("./db");
const { auth } = require("./middleware/authmiddleware");
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/users", userRouter);
app.use("/blogs", auth, blogRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
  
    console.log(`connected to DB at port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
