function status(request, response) {
  response.status(200).json({
    status: "healthy!",
  });
}

export default status;
