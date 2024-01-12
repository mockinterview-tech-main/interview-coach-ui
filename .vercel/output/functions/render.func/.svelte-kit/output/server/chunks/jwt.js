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
export {
  decodeJwt as d
};
