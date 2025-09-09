import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("Mongo URL:", process.env.MONGO_URI);

        mongoose.connection.on("connected", () => {
            console.log("✅ Successfully connected to MongoDB");
        });

        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected");
        });

        await mongoose.connect(process.env.MONGO_URI);

    } catch (error) {
        console.error("❌ Could not connect to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;