"use strict"

const Model = require("objection").Model

class Request extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "requests"
  }

  static addRequest(MovieParams) {
    return Request.query().insert({
      name: MovieParams.name,
      year: MovieParams.year,
      description: MovieParams.description,
    })
  }
}

module.exports = Request
