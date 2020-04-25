const MongoClient = require('mongodb').MongoClient;

class DatabaseManager {
    constructor() {
        this.client = null
        this.db = null
    }

    async connect_to_db() {
        const connectionURL = "mongodb+srv://House:jYrhNJ7GfCnZvKlv@hobbycluster-axhoq.mongodb.net/test?retryWrites=true&w=majority";

        MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true },
            (err, client) => {
                if (err) {
                    throw "Error!"
                }

                this.client = client
                this.db = this.client.db('test')
            })
    }

    get_db() {
        return this.db
    }

    close_db_connection() {
        if (this.client) {
            this.client.close()
        }
    }
}

let db_manager = new DatabaseManager()

module.exports = { db_manager }