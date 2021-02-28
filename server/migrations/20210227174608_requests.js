exports.up = (knex) =>
  knex.schema.createTable("requests", (table) => {
    table.increments("id").primary()
    table.string("name")
    table.string("description")
    table.string("year")
  })

exports.down = (knex) => knex.schema.dropTableIfExists("requests")
