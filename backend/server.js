const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("StudyBuddy Backend Running");
});
app.post("/courses", (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const query = "INSERT INTO courses (title) VALUES (?)";

    db.run(query, [title], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({
            message: "Course created successfully",
            courseId: this.lastID
        });
    });
});
app.get("/courses", (req, res) => {
    const query = "SELECT * FROM courses";

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);
    });
});
app.post("/courses/:id/notes", (req, res) => {
    const { title, content } = req.body;
    const courseId = req.params.id;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const query = `
        INSERT INTO notes (title, content, course_id)
        VALUES (?, ?, ?)
    `;

    db.run(query, [title, content, courseId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({
            message: "Note added successfully",
            noteId: this.lastID
        });
    });
});
app.get("/courses/:id/notes", (req, res) => {
    const courseId = req.params.id;

    const query = "SELECT * FROM notes WHERE course_id = ?";

    db.all(query, [courseId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);
    });
});
app.delete("/courses/:id", (req, res) => {
    const courseId = req.params.id;

    const query = "DELETE FROM courses WHERE id = ?";

    db.run(query, [courseId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: "Course deleted successfully" });
    });
});
app.put("/notes/:id", (req, res) => {
    const noteId = req.params.id;
    const { title, content } = req.body;

    const query = `
        UPDATE notes
        SET title = ?, content = ?
        WHERE id = ?
    `;

    db.run(query, [title, content, noteId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.json({ message: "Note updated successfully" });
    });
});
app.delete("/notes/:id", (req, res) => {
    const noteId = req.params.id;

    const query = "DELETE FROM notes WHERE id = ?";

    db.run(query, [noteId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.json({ message: "Note deleted successfully" });
    });
});
require("dotenv").config();
const axios = require("axios");
app.post("/notes/:id/summarize", async (req, res) => {
    const noteId = req.params.id;

    db.get(
        "SELECT content FROM notes WHERE id = ?",
        [noteId],
        async (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ message: "Note not found" });

            try {
                const response = await axios.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    {
                        model: "llama3-8b-8192",
                        messages: [
                            {
                                role: "user",
                                content: "Provide a clean, concise, and well-structured summary of the following text in perfect English. Make it readable and organized:\n\n" + row.content,
                            },
                        ],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const summary = response.data.choices[0].message.content;

                res.json({ summary });
            } catch (error) {
                console.log("Groq Error:", error.response?.data || error.message);
                res.status(500).json({
                    error: error.response?.data || error.message,
                });
            }
        }
    );
});
app.put("/courses/:id", (req, res) => {
    const courseId = req.params.id;
    const { title } = req.body;

    const query = "UPDATE courses SET title = ? WHERE id = ?";

    db.run(query, [title, courseId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: "Course updated successfully" });
    });
});
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});