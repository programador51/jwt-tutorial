const { Router } = require("express");
const { AddUser } = require("../controllers/authentication");

const router = Router();

router.post("/", AddUser);

module.exports = router;
