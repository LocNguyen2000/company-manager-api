import Logger from '../models/logger.mjs';
import mongoose from 'mongoose';

let logger = {
  stream: {
    writer: {},
  },

  async write(level, message, IP, user) {
    await Logger.create({ logLevel: level, message, user, IP });
  },

  async updateData(filter, data) {
    return await Logger.updateOne(filter, data);
  },

  async findData(condition) {
    return await Logger.find(condition);
  },

  async connect() {
    try {
      await mongoose.connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false');
      console.log('Connect Successfully!');
    } catch (error) {
      console.log(error);
    }
  },
};

export default logger;
