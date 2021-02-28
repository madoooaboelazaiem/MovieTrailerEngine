const bcrypt = require("bcryptjs")
const UserModel = require("../models/User")
const fs = require("fs")
const path = require("path")
require("dotenv").config()
const config = require("../config/setup")
const userSignup = async function (req, res) {
  var valid_params =
    req.body &&
    req.body.first_name &&
    req.body.last_name &&
    req.body.email &&
    req.body.password
  if (!valid_params) {
    return res
      .status(400)
      .send({ status: "failure", message: "Signup Paramters are missing" })
  } else {
    const email = req.body.email
    const findEmailAlreadyExists = await UserModel.getUserByEmail(email)
    if (findEmailAlreadyExists) {
      return res
        .status(400)
        .send({ status: "failure", message: "Email Already Exists" })
    } else {
      const encrypted = bcrypt.genSaltSync(10)
      const hashedPassword = bcrypt.hashSync(req.body.password, encrypted)
      req.body.password = hashedPassword
      const newUser = await UserModel.createNewUser(req.body)
      return res.status(200).send({
        status: "success",
        message: "User created successfully",
        data: newUser,
      })
    }
  }
}
const getAllUsers = async (req, res) => {
  const checkIfAdmin = await UserModel.findUserById(req.id)
  if (!checkIfAdmin.admin) {
    return res.status(403).send({
      status: "failure",
      message: "you are unauthorized to do this action",
    })
  }
  try {
    const allUsers = await UserModel.getAllUsers()
    if (allUsers) {
      return res.status(200).send({ status: "success", data: allUsers })
    } else {
      return res
        .status(400)
        .send({ status: "failure", message: "Error while fetching Users" })
    }
  } catch (error) {
    console.log(error)
    return res.status(400).send({
      status: "failure",
      message: "Error occurred while fetching Users",
    })
  }
}
const viewProfile = async (req, res) => {
  try {
    const checkIfUserExists = await UserModel.getUserById(req.id)
    if (!checkIfUserExists) {
      return res.status(403).send({
        status: "failure",
        message: "you are unauthorized to do this action",
      })
    } else {
      return res
        .status(200)
        .send({ status: "success", data: checkIfUserExists })
    }
  } catch (error) {
    console.log(error)
    return res.status(400).send({
      status: "failure",
      message: "Error occurred while fetching user information",
    })
  }
}

module.exports = {
  userSignup,
  getAllUsers,
  viewProfile,
}
