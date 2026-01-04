import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return sendError(res, 'User already exists with this email', 400);
    }

    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken(user._id);

    sendSuccess(res, {
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const token = generateToken(user._id);

    sendSuccess(res, {
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

