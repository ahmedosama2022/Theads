import mongoose from 'mongoose'

require('dotenv').config();

const dburl: string = process.env.DB_URL || '';

const connectDB = async () => {
    try {
        await mongoose.connect(dburl).then((data:any) => {
            console.log(`Database connected With ${data.connection.host}`)
        })
    } catch (error) {
        console.log(error);
        setTimeout(connectDB, 5000)
    }
}

export default connectDB;