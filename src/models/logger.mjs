import mongoose from "mongoose"

const Logger = new mongoose.Schema({
    logLevel: { type: String, required: true, enum: ['Error', 'Warning', 'Info' ] },
    user: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, required: true, default: new Date().toDateString() }
})

export default Logger;