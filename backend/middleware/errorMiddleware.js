const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error for the developer (you)

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error"
  });
};

module.exports = errorHandler;
