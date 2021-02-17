const mongoose = require('mongoose');

const connectDB = async (config) => {
    try {
        const conn = await mongoose.connect(config.database.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


module.exports = connectDB;