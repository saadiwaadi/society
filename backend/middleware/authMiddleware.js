const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Look for the token in the request headers
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  // Tokens usually look like: "Bearer 12345xyz"
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the secret you put in .env (yourmom123)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next(); // Let them pass to the next function
  } catch (err) {
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
}; 