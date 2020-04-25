require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const { db_manager } = require('./db')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.sendStatus(500)
})

app.listen(port, () => {
    console.log(`Express server listening to port ${port}`)
})

// API

db_manager.connect_to_db()
    .then(() => {
        const todosRouter = require('./router/todos-router')
        app.use('/api/todos', todosRouter)
    })
    .catch(err => {
        console.log(err)
    })

