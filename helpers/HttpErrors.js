const HttpErrors = (status, message) => {
  const error = Error(message);
  error.status = status;
  return error;
};

module.exports = HttpErrors