//pattern to validate email address
const pattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export function validateEmail(email: string) {
  console.log('validateEmail', email)
  // Regular expression for a simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Test the email against the regex
  return emailRegex.test(email)
}

export function validatePassword(password: string) {
  //if password is less than 6 characters
  if (password !== '' && password.length < 6) {
    return false
  }

  //if password is empty
  else if (password === '' || password.length === 0) return false

  //if all fields are valid
  return true
}
