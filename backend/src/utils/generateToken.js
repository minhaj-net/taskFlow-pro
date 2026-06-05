/**
 * utils/generateToken.js - JWT token generator
 * Signs a token with the user's ID. Token expires in 7 days.
 */

const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT for the given user ID.
 * @param {string} id - MongoDB ObjectId of the user
 * @returns {string} Signed JWT string
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = generateToken;
