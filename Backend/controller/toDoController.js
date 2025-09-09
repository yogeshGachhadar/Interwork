import ToDo from "../model/todoModel.js";

//create todo
export const createTodo = async (req, res) => {
    const { title, description, priority, dueDate, category } = req.body;
    const userId = req.user._id;

    if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required" });
    }

    const existingTodo = await ToDo.findOne({ title, user: userId });
    if (existingTodo) {
        return res.status(400).json({ message: "A todo with this title already exists" });
    }

    const todo = await ToDo.create({
        title, 
        description,
        priority,
        dueDate,
        category,
        user: userId
    });
    res.status(201).json({ message: "Todo created successfully", data: todo });
}


// get all todo
export const getTodo = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status, priority, category, sortBy } = req.query;

        let query = { user: userId };

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (category) query.category = { $regex: category, $options: "i" };

        let sortOptions = { createdAt: -1 };
        if (sortBy) {
            if (sortBy === "dueDate") sortOptions = { dueDate: 1 };
            else if (sortBy === "priority") sortOptions = { priority: 1 };
            else sortOptions = { [sortBy]: -1 };
        }

        const todos = await ToDo.find(query).sort(sortOptions);
        res.status(200).json({ message: "Todos fetched successfully", data: todos });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}

//findOne

//fetch single todo
export const singleTodo = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id) {
        return res.status(400).json({ message: "Todo ID is required" });
    }

    const todo = await ToDo.findOne({ _id: id, user: userId });
    if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Single todo fetched successfully", data: todo });
}


//update  todo
export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { title, description, status, priority, dueDate, category } = req.body;

        const todo = await ToDo.findOneAndUpdate(
            { _id: id, user: userId },
            { title, description, status, priority, dueDate, category },
            { new: true, runValidators: true }
        );

        if (!todo) {
            return res.status(404).json({ message: "Todo not found or unauthorized" });
        }

        res.status(200).json({ message: "Todo updated successfully", data: todo });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}

//delete todo
export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        if (!id) {
            return res.status(400).json({ message: "Todo ID is required" });
        }

        const todo = await ToDo.findOneAndDelete({ _id: id, user: userId });
        if (!todo) {
            return res.status(404).json({ message: "Todo not found or unauthorized" });
        }
        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}

// search the todo
export const searchTodo = async (req, res) => {
    try {
        const { query } = req.query;
        const userId = req.user._id;

        if (!query) {
            return res.status(400).json({ message: "Query is required" });
        }

        const todos = await ToDo.find({
            user: userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ]
        });

        res.status(200).json({ message: "Search results", data: todos });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}


