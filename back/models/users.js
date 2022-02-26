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

/**
 * Check if user credentials are correct
 * @param {string} email - Email from the input
 * @param {string} password - Password from the input
 */
const logIn = async (email, password) => {
  try {
    // 1. Validate user exists
    const canInsertEmail = await validateCanInsertEmail(email);

    // User no registered
    if (canInsertEmail) {
      return {
        message: "Credenciales incorrectas o usuario no existe",
        httpStatus: 404,
        successLogin: false,
        infoUser: null,
      };
    }

    // User registered
    const connection = await getConnection();
    const {
      recordset: [user],
    } = await connection
      .request()
      .input("email", sql.NVarChar(256), email)
      .query(
        `SELECT password , id , isPremium FROM Users WHERE email = @email`
      );

    // 2. Compare hashed pasword against database

    const isValidPassword = await new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, function (err, result) {
        if (!err) {
          resolve(result);
        }

        reject(err);
      });
    });

    if (!isValidPassword) {
      return {
        message: "Credenciales incorrectas o usuario no existe",
        httpStatus: 400,
        successLogin: false,
        infoUser: null,
      };
    }

    return {
      message: "Sesion iniciada",
      httpStatus: 200,
      successLogin: true,
      infoUser: {
        id: user.id,
        isPremium: user.idPremium,
        email,
      },
    };
  } catch (error) {}
};

/**
 * Add the refresh token to persist the session
 * @param {string} refreshToken - Refresh token generated
 * @param {number} idUser - Id of the user that logged in
 */
const saveToken = async (refreshToken, idUser) => {
  try {
    const connection = await getConnection();

    connection
      .request()
      .input("refreshToken", sql.NVarChar(256), refreshToken)
      .input("idUser", sql.Int, idUser)
      .query(
        "INSERT INTO RefreshTokens (refreshToken,userId) VALUES (@refreshToken,@idUser);"
      );
  } catch (error) {}
};

module.exports = {
  createUser,
  logIn,
  saveToken,
};
