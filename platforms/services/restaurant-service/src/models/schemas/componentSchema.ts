import { Schema } from 'mongoose';

export const componentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
}, { timestamps: true });
