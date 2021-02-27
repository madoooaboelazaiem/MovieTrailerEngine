exports.up = (knex) =>
  knex.schema.createTable("movies", (table) => {
    table.increments("id").primary()
    table.string("name", 100)
    table.string("description", 255)
    table.string("year", 15)
    table.string("trailer", 255)
    table.string("image", 255)
    table.string("director", 255)
  })

exports.down = (knex) => knex.schema.dropTableIfExists("movies")
