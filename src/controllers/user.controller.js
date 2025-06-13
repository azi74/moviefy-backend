import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/index.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  new ApiResponse(res, 200, user).send();
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { username, email },
    { new: true, runValidators: true }
  ).select('-password');

  new ApiResponse(res, 200, user).send();
});