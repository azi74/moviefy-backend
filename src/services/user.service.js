import { User } from '../models/index.js';

export const userService = {
  async createUser(userData) {
    return User.create(userData);
  },

  async findUserByEmail(email) {
    return User.findOne({ email });
  },

  async updateUser(userId, updateData) {
    return User.findByIdAndUpdate(userId, updateData, { new: true });
  }
};