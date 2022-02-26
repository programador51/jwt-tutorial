const express = require("express");
const app = express();
require("dotenv").config();

app.use(
  express.json({
    extended: true,
  })
);

app.use("/api/v1/usuarios", require("./routes/authentication"));

app.listen(process.env.PORT || 3000, () => console.log("Server connected"));
