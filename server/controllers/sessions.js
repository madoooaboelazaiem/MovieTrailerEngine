const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const UserModel = require("../models/User")
const tokenKey = require("../config/setup").secretOrKey
const crypto = require("crypto")
const fs = require("fs")
const EmailAdapter = require("../helpers/mailAdapter")
const path = require("path")
require("dotenv").config()
const config = require("../config/setup")
const Login = async function (req, res) {
  var valid_params = req.body && req.body.email && req.body.password
  if (!valid_params) {
    return res
      .status(400)
      .send({ status: "failure", message: "Login fields are missing" })
  } else {
    const { email, password } = req.body
    const checkIfUser = await UserModel.getUserByEmail(email)
    if (!checkIfUser) {
      return res
        .status(404)
        .send({ status: "failure", message: "Invalid email or password" })
    } else {
      const match = bcrypt.compareSync(password, checkIfUser.password)
      if (match) {
        const payload = {
          id: checkIfUser.id,
        }
        const token = jwt.sign(payload, tokenKey, { expiresIn: "5h" })
        if (checkIfUser.admin) {
          return res.status(200).send({
            status: "success",
            token: `bearer ${token}`,
            type: "admin",
            id: checkIfUser.id,
            name: checkIfUser.first_name + " " + checkIfUser.last_name,
          })
        } else {
          return res.status(200).send({
            status: "success",
            token: `bearer ${token}`,
            type: "User",
            id: checkIfUser.id,
            name: checkIfUser.first_name + " " + checkIfUser.last_name,
          })
        }
      } else {
        return res
          .status(404)
          .send({ status: "failure", message: "Invalid email or password" })
      }
    }
  }
}
const resetPassword = async function (req, res) {
  var valid_params = req.body && req.body.password
  if (!valid_params) {
    return res
      .status(400)
      .send({ status: "failure", message: "Reset Paramters are missing" })
  } else {
    const checkIfUser = await UserModel.getUserByEmail(email)
    if (!checkIfUser) {
      return res.status(403).send({
        status: "failure",
        message: "Email Does Not Exist",
      })
    }
    try {
      const encrypted = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(req.body.password, encrypted)
      var flag = false
      if (checkIfUser) {
        const updateUser = await UserModel.updatePassword(
          checkIfUser.id,
          hashedPassword
        )
        if (updateUser) flag = true
      }
      if (flag)
        return res
          .status(200)
          .send({ status: "success", message: "Password updated successfully" })
      else
        return res
          .status(400)
          .send({ status: "failure", message: "Error while updating password" })
    } catch (error) {
      console.log(error)
      return res
        .status(401)
        .send({ status: "failure", message: "Error while updating password" })
    }
  }
}

module.exports = {
  Login,
  resetPassword,
}
