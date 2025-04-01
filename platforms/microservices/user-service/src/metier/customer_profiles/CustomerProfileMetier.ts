import { ICustomerProfile } from "../../models/interfaces/ICustomerProfile";
import { BaseMetier } from "../../../../../services/base-classes/src/metier/base/BaseMetier";


/**
 * M�tier pour l'entit� CustomerProfile
 * @Author ModelGenerator - 2025-04-01T19:17:47.613Z - Cr�ation
 */
export class CustomerProfileMetier extends BaseMetier<ICustomerProfile, Partial<ICustomerProfile>> {
    constructor() {
        super('customer_profiles');
    }
}
