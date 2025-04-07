import { ICustomerProfile } from "../../models/interfaces/ICustomerProfile";
import { BaseMetier } from "../../../../../services/base-classes/src/metier/base/BaseMetier";


/**
 * M�tier pour l'entit� CustomerProfile
 * @Author ModelGenerator - 2025-04-07T12:21:07.854Z - Cr�ation
 */
export class CustomerProfileMetier extends BaseMetier<ICustomerProfile, Partial<ICustomerProfile>> {
    constructor() {
        super('customer_profiles');
    }
}
