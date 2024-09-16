import User from "../models/user.js";
import bcrypt from "bcryptjs";
import tokenAndCookie from "../token.js";

export const signup = async (req, res) => {
    try {
        const {userDetails} = req.body;
        const {name, email, password, confirmpassword, gender} = userDetails;

        if(password!==confirmpassword){
            return res.status(400).json({error:"Password not match"})
        }

        const user = await User.findOne({email});

        if (user) {
			return res.status(400).json({ error: "email already exists" });
		}

        const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			name,
			email,
			password:hashedPassword,
			gender,
			profilePic: `https://avatar.oxro.io/avatar.svg?name=${name}`,
		});

        if (newUser) {
            tokenAndCookie(newUser._id, res);
			await newUser.save();

			res.status(200).json({
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}

    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
		const {userDetails} = req.body;
        const {email, password} = userDetails;
		const user = await User.findOne({ email });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid email or password" });
		}

		tokenAndCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout = (req, res) => {
    try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};