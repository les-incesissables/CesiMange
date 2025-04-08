import { Transactions } from "../../models/entities/transactions/Transactions";
import { TransactionsCritereDTO } from "../../models/entities/transactions/TransactionsCritereDTO";
import { BaseMetier } from "../../../../../services/base-classes/src/metier/base/BaseMetier";

/**
 * M�tier pour l'entit� Transactions
 * @author Metier Generator - 2025-04-02T16:35:50.240Z - Creation
 */
export class TransactionsMetier extends BaseMetier<Transactions, TransactionsCritereDTO> {
    constructor() {
        super('Transactions', Transactions);
    }
}
