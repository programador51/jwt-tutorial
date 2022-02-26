const { Router } = require("express");
const { AddUser, LogIn } = require("../controllers/authentication");

const router = Router();

router.post("/", AddUser);

router.post("/iniciar-sesion", LogIn);

module.exports = router;
