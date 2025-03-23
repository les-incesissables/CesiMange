import { model } from 'mongoose';
import { IDeveloper } from '../interfaces/IDeveloper';
import { developerSchema } from '../schemas/developerSchema';

export const Developer = model<IDeveloper>('Developer', developerSchema);
