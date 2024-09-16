import User from "../models/user.js";

export const getAllUsers = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: {$ne: loggedInUserId}}).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in fetching all users: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const setStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const userId = req.user._id;

        // Update user's status in the database
        await User.findByIdAndUpdate(userId, { status });

        res.status(200).json({ message: "User status updated successfully" });
    } catch (error) {
        console.error("Error in setting user status:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};