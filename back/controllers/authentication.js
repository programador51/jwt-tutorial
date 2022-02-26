const { createUser } = require("../models/users");

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

module.exports = {
  AddUser,
};
