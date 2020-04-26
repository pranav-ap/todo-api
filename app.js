const express = require('express')

const app = express()

app.use(express.json())

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.sendStatus(500)
})

const todosRouter = require('./router/todos-router')
app.use('/api/todos', todosRouter)

module.exports = { app }