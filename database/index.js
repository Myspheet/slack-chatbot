import { connect, model } from 'mongoose';

//'mongodb://localhost:27017/test'
export default class Database {
    MessageModel = model('message', {
        userId: Number,
        userName: String,
        message: String
    });

    static singleInstance = new Database();

    static getInstance() {
        return Database.singleInstance();
    }

    constructor() {
        //
    }

    async load(ddResourceURI) {
        this.connection = await connect(ddResourceURI, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    close() {
        this.connection.close();
    }
    /**
     * Saves a message frm slack
     * @param {*} userId_ slack id of message sender
     * @param {*} userName_ username of message sender
     * @param {*} message_ message to send
     * @throws Error if message saving failed
     */
    async saveMessage(userId_, userName_, message_) {
        const h = new this.MessageModel({
            userId: userId_,
            userName: userName_,
            message: message_
        });
        await h.save();
    }
    static getMessageByUsername(userName_) {
        return new this.MessageModel({ userName: userName_ });
    }
    static getMessageByUserId(userId_) {
        return new this.MessageModel({ userId: userId_ });
    }

}


function main() {
    const db = Database.getInstance();
    db.load('mongodb://localhost:27017/test');
    db.saveMessage(234, 'someUserName', "put the message ehre");
    const message = db.getMessageByUserId(234);
    db.close();
}