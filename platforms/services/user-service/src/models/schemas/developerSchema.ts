import { Schema } from 'mongoose';

export const developerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  expertise: {
    type: [String],
    required: true,
  },
}, { timestamps: true });
