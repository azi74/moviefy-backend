import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/index.js';
import { generateTokens } from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(400, 'Username or email already exists');
  }

  const user = await User.create({ username, email, password });
  const tokens = generateTokens(user._id);

  new ApiResponse(res, 201, {
    user: { _id: user._id, username: user.username, email: user.email },
    tokens
  }).send();
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const tokens = generateTokens(user._id);
  new ApiResponse(res, 200, {
    user: { _id: user._id, username: user.username, email: user.email },
    tokens
  }).send();
});