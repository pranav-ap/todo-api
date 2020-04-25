const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())

const todosRouter = require('./router/todos-router')
app.use('/api/todos', todosRouter)

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(port, () => {
    console.log(`Express server listening to port ${port}`)
})
