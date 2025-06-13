import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token, isRefresh = false) => {
  try {
    return jwt.verify(
      token,
      isRefresh ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET
    );
  } catch (error) {
    throw new ApiError(401, 'Invalid token');
  }
};