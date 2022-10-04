import mongoose from 'mongoose';

const Logger = new mongoose.Schema(
  {
    logLevel: { type: String, required: true, enum: ['Error', 'Warning', 'Info'], default: 'Info' },
    user: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default Logger;
