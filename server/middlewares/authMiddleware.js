import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // get token from header
    const token = req.header("authorization").split(" ")[1];
    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decryptedToken.userId;
    next();
  } catch (error) {
    const message =
      error.message === "jwt expired"
        ? "Session expired. Please log in again."
        : error.message;

    res.send({
      success: false,
      message,
    });
  }
};

export default authMiddleware;
