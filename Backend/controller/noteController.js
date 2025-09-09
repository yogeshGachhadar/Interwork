import Note from "../model/noteModel.js";

// Create Note
export const createNote = async (req, res) => {
    try {
        const { title, content, color } = req.body;
        const userId = req.user._id;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const note = await Note.create({
            title,
            content,
            color,
            user: userId
        });

        res.status(201).json({ message: "Note created successfully", data: note });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get All Notes for User
export const getNotes = async (req, res) => {
    try {
        const userId = req.user._id;
        const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json({ message: "Notes fetched successfully", data: notes });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get Single Note
export const getSingleNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const note = await Note.findOne({ _id: id, user: userId });
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ message: "Note fetched successfully", data: note });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update Note
export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { title, content, color } = req.body;

        const note = await Note.findOneAndUpdate(
            { _id: id, user: userId },
            { title, content, color },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({ message: "Note not found or unauthorized" });
        }

        res.status(200).json({ message: "Note updated successfully", data: note });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete Note
export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const note = await Note.findOneAndDelete({ _id: id, user: userId });
        if (!note) {
            return res.status(404).json({ message: "Note not found or unauthorized" });
        }
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};
