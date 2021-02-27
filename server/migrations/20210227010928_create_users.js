exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary()
    table.string("email", 255).unique()
    table.boolean("admin")
    table.string("password", 255)
    table.string("first_name", 255)
    table.string("last_name", 255)
    table.timestamps()
    table.index(["email"])
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users")
}
