const { createUser, logIn, saveToken } = require("../models/users");
const jwt = require("jsonwebtoken");

/**
 * Handle the creation of a new user
 * @param {Express.Request} req - Express request
 * @param {Express.Response} res - Express response
 */
const AddUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { httpStatus, message } = await createUser(email, password);

    res.status(httpStatus).json({
      message,
    });
  } catch (error) {
    const { message } = error;

    res.status(500).json({
      message,
    });
  }
};

/**
 * Handle the login
 * @param {Express.Request} req - Express request
 * @param {Express.Response} res - Express response
 */
const LogIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { httpStatus, message, successLogin, infoUser } = await logIn(
      email,
      password
    );

    if (!successLogin) {
      res.status(httpStatus).json({
        message,
      });
      return;
    }

    const accessToken = jwt.sign(infoUser, process.env.JWT_SECRET_WORD, {
      expiresIn: "3m",
    });

    const refreshToken = jwt.sign(infoUser, process.env.JWT_SECRET_WORD);

    await saveToken(refreshToken, infoUser.id);

    const configCookies = {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    };

    res
      .status(200)
      .cookie(process.env.JWT_REFRESH_NAME, refreshToken, configCookies)
      .cookie(process.env.JWT_ACCESS_NAME, accessToken, configCookies)
      .json(infoUser);
  } catch (error) {
    res.status(500).send("error");
  }
};

module.exports = {
  AddUser,
  LogIn,
};
