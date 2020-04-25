const MongoClient = require('mongodb').MongoClient;

class DatabaseManager {
    constructor() {
        client = null
        db = null
    }

    connect_to_db() {
        const uri = "mongodb+srv://House:jYrhNJ7GfCnZvKlv@hobbycluster-axhoq.mongodb.net/test?retryWrites=true&w=majority";

        client = new MongoClient(uri, { useNewUrlParser: true });

        client.connect(err => {
            if (!err) {
                db = client.db("zoo")
            }
        })
    }

    get_db() {
        return db
    }

    close_db_connection() {
        if (client) {
            client.close()
        }
    }
}

db_manager = DatabaseManager()

module.exports = { db_manager }