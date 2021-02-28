exports.up = (knex) =>
  knex.schema.createTable("movies", (table) => {
    table.increments("id").primary()
    table.string("name")
    table.text("description")
    table.string("year")
    table.text("trailer")
    table.string("image")
    table.string("director")
    table.boolean("favourites").defaultTo(false)
    table.string("tmdb_id")
  })

exports.down = (knex) => knex.schema.dropTableIfExists("movies")
