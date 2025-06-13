// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.model.js';

// Named export (recommended)
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new ApiError(401, 'Unauthorized - No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new ApiError(401, 'Unauthorized - User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, 'Unauthorized - Invalid token'));
  }
};
