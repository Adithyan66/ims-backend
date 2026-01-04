export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    data,
    message
  });
};

export const sendError = (res, message = 'Error occurred', statusCode = 400, errors = null) => {
  const response = {
    status: 'error',
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

