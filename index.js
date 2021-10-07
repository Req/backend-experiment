import express from 'express';
import dotenv from 'dotenv';
import { connect } from './database.js';
import { User } from './models/user.js';

// Create express server
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    console.log("[Request] " + req.method + " " + req.path);
    next();
});

// Load configuration
dotenv.config();
await connect();

// Add routes / endpoints
app.post("/users", async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch(error) {
        error.client = true;
        next(error)
    }
})

app.get("/users", async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json(users);   
    } catch (error) {
        error.client = true;
        next(error)
    }
});

app.delete("/users", async (req, res, next) => {
    try {
        const report = await User.deleteMany({});
        res.json(report);
    } catch (error) {
        error.client = true;
        next(error)
    }
})

app.get("/users/:id", async (req, res, next) => {
    try {
        const query = User.findById(req.params.id);
        query.select("-password");
        query.populate("following", ["_id", "username", "thought"]);

        const user = await query.exec();


        res.json(user);
    } catch (error) {
        error.client = true;
        next(error)
    }
});

// WARNING: Untested code :)
// Add user2 to the "following" of user1 and add user1 to the "followers" of user2
app.post("/users/:id:/follow/:otherid", async (req, res) => {
    // WARNING: Untested code :)
    const user1 = await User.findWithId(req.params.id);
    const user2 = await User.findWithId(req.params.otherid);
    // WARNING: Untested code :)
    user1.following.push(user2);
    user2.followers.push(user1);
    await user1.save();
    await user2.save();
    // WARNING: Untested code :)
    res.send({ ok: true });
    // WARNING: Untested code :)
});

app.patch("/users/:id", async (req, res, next) => {
    try {
        const options = { new: true };
        const user = await User.findByIdAndUpdate(req.params.id, req.body, options);
        res.json(user);
    } catch (error) {
        error.client = true;
        next(error)    
    }
});

app.delete("/users/:id", async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, deleted: user });
    } catch (error) {
        error.client = true;
        next(error)
    }
})

// Add custom 404 handler
app.use((req,res) => {
    res.status(404);
    res.json({ error: "Not found" });
});

app.use((err, req, res, next) => {
    if (err.client) {
        res.status(400).json({ error: err.message });
    } else {
        res.status(500).send({ error: err });
    }
});

// Start express server listening
app.listen(process.env.PORT, () => {
    console.log("App started listening to requests http://localhost:"+process.env.PORT)
});