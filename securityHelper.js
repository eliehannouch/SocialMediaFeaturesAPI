const crypto = require("crypto");
const algorithm = process.env.ENC_ALGO; //ENC_ALGO=aes-256-cbc
const initVector = crypto.randomBytes(16);
const SecurityKey = crypto.randomBytes(32);

exports.encrypt_DecryptDATA = (field, action) => {
  if (action === "encrypt") {
    const cipher = crypto.createCipheriv(algorithm, SecurityKey, initVector);

    let encryptedData = cipher.update(field, "utf-8", "hex");

    encryptedData += cipher.final("hex");

    return encryptedData;
  } else if (action === "decrypt") {
    const decipher = crypto.createDecipheriv(
      algorithm,
      SecurityKey,
      initVector
    );

    let decryptedData = decipher.update(field, "hex", "utf-8");

    decryptedData += decipher.final("utf8");

    return decryptedData;
  }
};
