const { MongoClient } = require('mongodb')

class DatabaseManager {
    constructor() {
        this.client = null
        this.db = null
    }

    async connect_to_db() {
        const connectionURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/test?retryWrites=true&w=majority`

        this.client = await MongoClient
            .connect(connectionURL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .catch(err => { console.log(err); });

        this.db = this.client.db('test')
    }

    async close_db_connection() {
        if (this.client) {
            await this.client.close()
        }
    }

    get_db() {
        return this.db
    }
}

module.exports = { DatabaseManager }