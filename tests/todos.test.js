const { app } = require('../app')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { DatabaseManager } = require('./../db')

describe('Todo Tests', () => {
    let db_manager = null
    let mock_data = [
        {
            "_id": new ObjectID(),
            "text": "buy goats",
            "completed": false,
            "tags": ["home"]
        },
        {
            "_id": new ObjectID(),
            "text": "buy nuclear reactor",
            "completed": false,
            "tags": ["work"]
        }
    ]

    beforeAll(async () => {
        db_manager = new DatabaseManager()
        await db_manager.connect_to_db()

        let db = await db_manager.get_db()
        await db.collection('todos').deleteMany()
    })

    afterAll(async () => {
        await db_manager.close_db_connection()
        db_manager = null
    })

    beforeEach(async () => {
        let db = await db_manager.get_db()
        await db.collection('todos').insertMany(mock_data)
    })

    afterEach(async () => {
        let db = await db_manager.get_db()
        await db.collection('todos').deleteMany()
    })

    describe('GET', () => {
        it('Get all todos', async () => {
            const response = await request(app)
                .get('/api/todos')
                .send()

            expect(response.status).toEqual(200)
            expect(response.body).toHaveLength(2)
        })

        it('Get todo by ID', async () => {
            const id = mock_data[0]._id

            const response = await request(app)
                .get(`/api/todos/${id}`)
                .send()

            expect(response.status).toEqual(200)

            expect(response.body.text).toEqual("buy goats")
            expect(response.body.completed).toBeFalsy()
            expect(response.body.tags).toEqual(["home"])
        })

        it('Get todos by tag', async () => {
            const tag = 'home'

            const response = await request(app)
                .post(`/api/todos/tags/${tag}`)
                .send()

            expect(response.status).toEqual(200)
            expect(response.body).toHaveLength(1)
        })

    })

    describe('DELETE', () => {
        it('Delete all todos', async () => {
            const response = await request(app)
                .delete('/api/todos')
                .send()

            expect(response.status).toEqual(200)
            expect(response.body.deletedCount).toEqual(2)
        })

        it('Delete todo by ID', async () => {
            const id = mock_data[0]._id

            const response = await request(app)
                .delete(`/api/todos/${id}`)
                .send()

            expect(response.status).toEqual(200)
            expect(response.body.deletedCount).toEqual(1)
        })
    })

    describe('POST', () => {
        it('Add new todo', async () => {
            const new_todo = {
                text: "Buy dogs",
                completed: false,
                tags: ["home"]
            }

            const response = await request(app)
                .post('/api/todos')
                .send(new_todo)

            expect(response.status).toEqual(200)

            expect(response.body.text).toEqual(new_todo.text)
            expect(response.body.completed).toEqual(new_todo.completed)
            expect(response.body.tags).toEqual(new_todo.tags)
        })
    })

    describe('PATCH', () => {
        it('Set all as complete', async () => {
            const response = await request(app)
                .patch('/api/todos/complete_all')
                .send()

            expect(response.status).toEqual(200)
            expect(response.body.modifiedCount).toEqual(2)
        })

        it('Update a todo', async () => {
            const id = mock_data[0]._id
            const updated_todo = {
                text: "Buy a german shepard"
            }

            const response = await request(app)
                .patch(`/api/todos/${id}`)
                .send(updated_todo)

            expect(response.status).toEqual(200)
            expect(response.body.modifiedCount).toEqual(1)
        })
    })
})
