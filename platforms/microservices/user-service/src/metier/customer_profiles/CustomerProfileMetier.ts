import { ICustomerProfile } from "../../models/interfaces/ICustomerProfile/ICustomerProfile";
import { BaseMetier } from "../../../../../services/base-classes/src/metier/base/BaseMetier";


/**
 * M�tier pour l'entit� CustomerProfile
 * @Author ModelGenerator - 2025-04-07T21:48:27.156Z - Cr�ation
 */
export class CustomerProfileMetier extends BaseMetier<ICustomerProfile, Partial<ICustomerProfile>> {
    constructor() {
        super('customer_profiles');
    }
}
