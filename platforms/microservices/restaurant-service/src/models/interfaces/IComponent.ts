import { Document } from 'mongoose';

export interface IComponent extends Document {
  name: string;
  description: string;
  version: string;
  tags: string[];
}
