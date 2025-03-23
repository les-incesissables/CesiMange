import { model } from 'mongoose';
import { IComponent } from '../interfaces/IComponent';
import { componentSchema } from '../schemas/componentSchema';

export const Component = model<IComponent>('Component', componentSchema);
