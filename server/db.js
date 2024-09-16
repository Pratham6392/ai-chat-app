import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected")
        // console.log("=====",process.env.MONGODB_URI)
    } catch (error) {
        console.log("Not Connected to MongoDB: ", error.message)
        // console.log("=====",process.env.MONGODB_URI)
    }
}

export default connectMongoDB;