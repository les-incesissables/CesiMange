import { ICustomerProfile } from "../../models/interfaces/ICustomerProfile/ICustomerProfile";
import { BaseMetier } from "../../../../../services/base-classes/src/metier/base/BaseMetier";


/**
 * M�tier pour l'entit� CustomerProfile
 * @Author ModelGenerator - 2025-04-08T19:18:06.326Z - Cr�ation
 */
export class CustomerProfileMetier extends BaseMetier<ICustomerProfile, Partial<ICustomerProfile>> {
    constructor() {
        super('customer_profiles');
    }
}
