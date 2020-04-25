const express = require('express')
const shortid = require('shortid')
const router = express.Router()

let db = {
    todos: {}
}

router.get('/', (req, res) => {
    let result = db['todos']
    res.send(result)
})

router.get('/:id', (req, res) => {
    console.log(db['todos'])

    if (db['todos'][req.params.id]) {
        let result = db['todos'][req.params.id]
        return res.send(result)
    }

    res.sendStatus(500)
})

router.post('/', (req, res) => {
    const id = shortid.generate()

    db['todos'][id] = {
        id,
        ...req.body
    }

    let result = db['todos'][id]
    res.send(result)
})

router.delete('/:id', (req, res) => {
    if (db['todos'][req.params.id]) {
        let result = db['todos'][req.params.id]
        delete db['todos'][req.params.id]
        return res.send(result)
    }

    res.sendStatus(500)
})

router.delete('/', (req, res) => {
    db['todos'] = {}
    res.sendStatus(200)
})

router.patch('/:id', (req, res) => {
    if (db['todos'][req.params.id]) {
        let todo = db['todos'][req.params.id]
        todo = {
            ...todo,
            ...req.body
        }

        db['todos'][req.params.id] = todo
        return res.send(todo)
    }

    res.sendStatus(500)
})

module.exports = router
