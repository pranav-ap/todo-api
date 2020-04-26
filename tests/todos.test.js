const { app } = require('../app')
const request = require('supertest')

const { DatabaseManager } = require('./../db')

describe('Todo Tests', () => {
    let db_manager = null

    beforeAll(async () => {
        db_manager = new DatabaseManager()
        await db_manager.connect_to_db()
    })

    afterAll(async () => {
        await db_manager.close_db_connection()
        db_manager = null
    })

    beforeEach(async () => {
        let db = await db_manager.get_db()

        await db.collection('todos').insertMany([
            {
                "text": "buy goats",
                "completed": false,
                "tags": ["home"]
            },
            {
                "text": "buy nuclear reactor",
                "completed": false,
                "tags": ["work"]
            }
        ])
    })

    afterEach(async () => {
        let db = await db_manager.get_db()
        await db.collection('todos').deleteMany()
    })

    it('Get all todos', async done => {
        const response = await request(app)
            .get('/api/todos')
            .send()

        expect(response.status).toBe(200)
        expect(response.body.length).toEqual(2)
        done()
    })
})

