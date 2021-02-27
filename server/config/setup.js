require("dotenv").config()

module.exports = {
  ENV: process.env.NODE_ENV,
  port: process.env.port,
  secretOrKey: process.env.secret,
  email_user: process.env.email_user,
  email_pass: process.env.email_pass,
  frontend_url: process.env.FRONTEND_URL,
}
