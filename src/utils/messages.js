const generateMessage = (user, message) => {
  return {
    user,
    message,
    createdAt: new Date().getTime()
  }
}

const generateLocation = (user, uri) => {
  return {
    user,
    uri,
    createdAt: new Date().getTime()
  }
}

export {
  generateMessage,
  generateLocation
}