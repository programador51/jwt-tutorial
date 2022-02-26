const bcrypt = require("bcrypt");
const { getConnection } = require("../config/db");
const sql = require("mssql");

/**
 * Create a new user
 * @param {string} email - Email of the user
 * @param {string} notHashedPassword - Password the user typed
 * @returns {import("../types/users").ResCreateUserI} Response of trying insert the register
 */
const createUser = async (email, notHashedPassword) => {
  const saltRounds = 10;

  try {
    const hashedPasword = await new Promise((resolve, reject) => {
      bcrypt.hash(notHashedPassword, saltRounds, function (err, hash) {
        if (err) {
          reject(err);
        }

        resolve(hash);
      });
    });

    const canInsertEmail = await validateCanInsertEmail(email);

    if (!canInsertEmail) {
      return {
        message: "El email ya existe, intenta uno diferente",
        httpStatus: 409,
      };
    }

    const connection = await getConnection();

    await connection
      .request()
      .input("email", sql.NVarChar(256), email)
      .input("password", sql.NVarChar(sql.MAX), hashedPasword)
      .execute("sp_createUser");

    return {
      message: "El usuario se registro",
      httpStatus: 200,
    };
  } catch (error) {
    console.log(error);

    throw {
      message: "Fallo al insertar el usuario",
    };
  }
};

/**
 * Check if the user can be inserted on the database
 * @param {string} email - Email to validate
 * @returns {boolean} True if it can be inserted
 */
const validateCanInsertEmail = async (email) => {
  try {
    const connection = await getConnection();

    const {
      recordset: [result],
    } = await connection
      .request()
      .input("email", sql.NVarChar(256), email)
      .execute("sp_validateCanInsertUser");

    return result.canInsertEmail;
  } catch (error) {
    return false;
  }
};

module.exports = {
  createUser,
};
