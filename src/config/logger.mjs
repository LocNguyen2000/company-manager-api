import Logger from '../models/logger.mjs';
import mongoose from 'mongoose';

let logger = {
  stream: {
    
  },

  async write(level, message, user) {
    await Logger.create({ logLevel: level, message, user});
  },

  async updateData(filter, data) {
    return await Logger.updateOne(filter, data);
  },

  async findData(condition) {
    return await Logger.find(condition);
  },
};

export default logger;
