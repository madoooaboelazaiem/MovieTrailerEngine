require("dotenv").config()
const express = require("express")
const cors = require("cors")

const bodyParser = require("body-parser")

const Model = require("objection").Model
const knexInit = require("knex")
const knexConfig = require("./knexfile")
const knex = knexInit(knexConfig[process.env.NODE_ENV])
Model.knex(knex)

const app = express()

const session = require("./routes/sessions")
const users = require("./routes/users")
const movies = require("./routes/movies")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.get("/", (req, res) => {
  res.send(`<h1>CouchPotato Welcomes You </h1>`)
})

app.use("/api/sessions", session)
app.use("/api/movies", movies)
app.use("/api/users", users)

const port = process.env.port
app.listen(port, (req, res) => {
  console.log(`Server up and running on port ${port}`)
})
