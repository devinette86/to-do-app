import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import Task from "./models/Task.js";

const app = express();

const PORT = 4321;
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

app.use(express.json());
app.use(cors());

const connectDB = () => {
  mongoose
    .connect(uri, { dbName })
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((error) => console.log(error.message));
};
connectDB();

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.get("/task/complete/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.complete = !task.complete;
  task.save();
  res.json(task);
});

app.post("/task/new", (req, res) => {
  const task = new Task({
    text: req.body.text,
  });
  task.save();
  res.json(task);
});

app.put("/task/update/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.text = req.body.text;
  task.save();
  res.json(task);
});

app.delete("/task/delete/:id", async (req, res) => {
  const result = await Task.findByIdAndDelete(req.params.id);
  res.json({ result });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
