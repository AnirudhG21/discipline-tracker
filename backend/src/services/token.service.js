const crypto = require("crypto");

exports.generateToken = () => {
  return crypto.randomUUID();
};
