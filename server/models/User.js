"use strict"

const Model = require("objection").Model

class User extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "users"
  }

  static findUserByEmailAndPassword(email, password) {
    return User.query().findOne({ email, password })
  }
  static getUserByEmail(email) {
    return User.query().findOne({ email })
  }

  static getAllUsers() {
    return Movie.query().select("*").orderBy("id", "desc")
  }
  static findUserById(id) {
    if (id == null || typeof id !== "number") {
      throw new Error("can;t all findUserById with null id")
    }
    return User.query().findOne({ id })
  }

  static createUser(userParams) {
    return User.query().insert({ email: userParams.email })
  }

  static async createNewUser(userParams) {
    return User.query().insert({
      email: userParams.email,
      first_name: userParams.first_name,
      last_name: userParams.last_name,
      password: userParams.password,
      admin: false,
    })
  }
  static async updatePassword(id, newPassword) {
    var find = await User.query().findOne({
      id,
    })
    var insert = await find.$query().updateAndFetch({
      password: newPassword,
    })
    return insert
  }
}

module.exports = User
