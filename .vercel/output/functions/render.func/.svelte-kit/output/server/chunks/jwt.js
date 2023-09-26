import jwt from "jsonwebtoken";
const decodeJwt = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (e) {
    console.error("Failed to decode token:", e);
    return null;
  }
};
const validateJwt = (token, secret) => {
  try {
    const valid = jwt.verify(token, secret);
    console.log(valid);
    return valid;
  } catch (e) {
    console.error("Invalid token: ", e);
  }
};
export {
  decodeJwt as d,
  validateJwt as v
};
