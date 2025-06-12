import User from "../models/user.model.js";
import { generateToken } from "../lib/jwt.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" }); 
    }

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // get random avatar
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const newUser = new User({
      username,
      email,
      password,
      avatar,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Error creating user" }); 
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
};