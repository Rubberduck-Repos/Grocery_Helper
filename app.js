require('dotenv').config();

const express = require("express");

const mealRouter = require("./routes/mealRouter");

const app = express();
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use("/", mealRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));