const express = require('express')
const ObjectID = require('mongodb').ObjectID
const router = express.Router()

const { DatabaseManager } = require('./../db')

let db_manager = new DatabaseManager()

// PATCH

router.patch('/complete_all', async (req, res) => {
    await db_manager.connect_to_db()
    let db = await db_manager.get_db()

    let result = await db.collection('todos').updateMany({
        completed: false
    }, {
        $set: { completed: true }
    })

    await db_manager.close_db_connection()

    if (result) {
        return res.send({ 'modifiedCount': result.modifiedCount })
    }

    res.sendStatus(500)
})

router.patch('/:id', async (req, res) => {
    await db_manager.connect_to_db()
    let db = await db_manager.get_db()

    let result = await db.collection('todos').updateOne({
        "_id": ObjectID(req.params.id)
    }, {
        $set: { ...req.body },
        $currentDate: { lastModified: true }
    })

    await db_manager.close_db_connection()

    if (result) {
        return res.send({ 'modifiedCount': result.modifiedCount })
    }

    res.sendStatus(500)
})

// GET

router.get('/tags/:tag', async (req, res) => {
    await db_manager.connect_to_db()
    let db = await db_manager.get_db()

    let result = await db.collection('todos')
        .find({ "tags": req.params.tag })
        .toArray()

    await db_manager.close_db_connection()

    if (result) {
        return res.send(result)
    }

    res.sendStatus(500)
})

router.get('/:id', async (req, res) => {
    await db_manager.connect_to_db()
    let db = await db_manager.get_db()

    let result = await db.collection('todos')
        .find({ "_id": ObjectID(req.params.id) })
        .toArray()

    await db_manager.close_db_connection()

    if (result && result[0]) {
        return res.send(result[0])
    }

    res.sendStatus(500)
})

router.get('/', async (req, res) => {
    await db_manager.connect_to_db()
    let db = await db_manager.get_db()

    let result = await db.collection('todos')
        .find({})
        .toArray()

    await db_manager.close_db_connection()

    if (result) {
        return res.send(result)
    }

    res.sendStatus(500)
})

// POST

router.post('/', async (req, res) => {
    await db_manager.connect_to_db()
    let db = await db_manager.get_db()

    let result = await db.collection('todos').insertOne(req.body)
    await db_manager.close_db_connection()

    if (result.ops && result.ops.length == 1) {
        return res.send(result.ops[0])
    }

    res.sendStatus(500)
})

// DELETE

router.delete('/:id', async (req, res) => {
    await db_manager.connect_to_db()
    let db = await db_manager.get_db()

    let result = await db.collection('todos').deleteOne({
        "_id": ObjectID(req.params.id)
    })

    await db_manager.close_db_connection()

    if (result) {
        return res.send({ 'deletedCount': result.deletedCount })
    }

    res.sendStatus(500)
})

router.delete('/', async (req, res) => {
    await db_manager.connect_to_db()
    let db = await db_manager.get_db()

    let result = await db.collection('todos').deleteMany()
    await db_manager.close_db_connection()

    if (result) {
        return res.send({ 'deletedCount': result.deletedCount })
    }

    res.sendStatus(500)
})

module.exports = router
