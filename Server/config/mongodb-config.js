
const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        const mongoUri = process.env.MONGO_DB_URL || process.env.MONGO_URL;
        if (!mongoUri || typeof mongoUri !== 'string' || !mongoUri.trim()) {
            console.error('❌ MONGO_DB_URL is not set. Please set it in Server/.env. Example: MONGO_DB_URL=mongodb://localhost:27017/yourdbname');
            return;
        }

        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB successfully!');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = connectMongoDB;