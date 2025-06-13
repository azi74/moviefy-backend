import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { chatService } from '../services/chat.service.js';

export const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const userId = req.user?._id;

  if (!message) {
    throw new ApiError(400, 'Message is required');
  }

  const response = await chatService.processMessage(userId, message);
  new ApiResponse(res, 200, response).send();
});