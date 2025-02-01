const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 5000;

// Use Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = "mongodb+srv://email:email@cluster0.yfo5lts.mongodb.net/myDatabase"; // Replace with your DB name
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("connected", () => console.log("✅ Connected to MongoDB successfully"));
db.on("error", (err) => console.error("❌ MongoDB connection error:", err));

// Define Schemas
const visitorSchema = new mongoose.Schema({
    count: { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema({
    email: String
});

// Define Models
const Visitor = mongoose.model("Visitor", visitorSchema);
const User = mongoose.model("User", userSchema);

// Routes
app.get("/", (req, res) => res.send("Hello World!"));

// Track Visitors (Count Total Visits)
app.get("/track-visitor", async (req, res) => {
    try {
        let visitorData = await Visitor.findOne();

        if (!visitorData) {
            visitorData = new Visitor({ count: 1 });
        } else {
            visitorData.count += 1;
        }

        await visitorData.save();

        res.json({ message: "Visit tracked successfully", totalVisitors: visitorData.count });

    } catch (err) {
        console.error("Error tracking visitor:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Save Emails
app.post("/email", async (req, res) => {
    try {
        const user = new User({ email: req.body.email });
        await user.save();
        res.status(201).json({ status: "success", message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
app.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
