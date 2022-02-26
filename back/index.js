const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();

app.use(
  express.json({
    extended: true,
  })
);

app.use(cookieParser());

app.use("/api/v1/usuarios", require("./routes/authentication"));

app.listen(process.env.PORT || 3000, () => console.log("Server connected"));
