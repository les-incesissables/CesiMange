import { model } from 'mongoose';
import { IUser } from '../interfaces/IUser';
import { userSchema } from '../schemas/userSchema';

export const User = model<IUser>('User', userSchema);
