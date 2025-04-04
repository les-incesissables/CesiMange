import { ICustomerProfile } from '../../models/interfaces/ICustomerProfile';
import { BaseMetier } from '../../../../../services/base-classes/src/metier/base/BaseMetier';

/**
 * M�tier pour l'entit� CustomerProfile
 * @Author ModelGenerator - 2025-04-02T16:35:47.251Z - Cr�ation
 */
export class CustomerProfileMetier extends BaseMetier<ICustomerProfile, Partial<ICustomerProfile>> {
    constructor() {
        super('user_profiles');
    }
}
