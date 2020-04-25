const express = require('express')
const ObjectID = require('mongodb').ObjectID
const router = express.Router()

const { db_manager } = require('./../db')

router.get('/', async (req, res) => {
    let db = db_manager.get_db()

    let result = await db.collection('todos').find({}).toArray()

    if (result) {
        return res.send(result)
    }

    res.sendStatus(500)
})

router.get('/:id', async (req, res) => {
    let db = db_manager.get_db()

    let result = await db.collection('todos').find({
        "_id": ObjectID(req.params.id)
    }).toArray()

    if (result && result[0]) {
        return res.send(result[0])
    }

    res.sendStatus(500)
})

router.post('/', async (req, res) => {
    let db = db_manager.get_db()

    let result = await db.collection('todos').insertOne(req.body)

    if (result.ops && result.ops.length == 1) {
        return res.send(result.ops[0])
    }

    res.sendStatus(500)
})

router.delete('/:id', async (req, res) => {
    let db = db_manager.get_db()

    let result = await db.collection('todos').deleteOne({
        "_id": ObjectID(req.params.id)
    })

    if (result) {
        return res.send({ "deleted ": result.deletedCount })
    }

    res.sendStatus(500)
})

router.delete('/', async (req, res) => {
    let db = db_manager.get_db()

    let result = await db.collection('todos').deleteMany()

    if (result) {
        return res.send({ "deleted ": result.deletedCount })
    }

    res.sendStatus(500)
})

router.patch('/complete_all', async (req, res) => {
    let db = db_manager.get_db()

    let result = await db.collection('todos').updateMany({
        completed: false
    }, {
        $set: { completed: true }
    })

    if (result) {
        return res.send({ "modifiedCount ": result.modifiedCount })
    }

    res.sendStatus(500)
})

router.patch('/:id', async (req, res) => {
    let db = db_manager.get_db()

    let result = await db.collection('todos').updateOne({
        "_id": ObjectID(req.params.id)
    }, {
        $set: { ...req.body },
        $currentDate: { lastModified: true }
    })

    if (result) {
        return res.send({ "modifiedCount ": result.modifiedCount })
    }

    res.sendStatus(500)
})

module.exports = router
