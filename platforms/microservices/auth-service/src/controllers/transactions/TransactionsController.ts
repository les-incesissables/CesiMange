import { Transactions } from "../../models/entities/transactions/Transactions";
import { TransactionsCritereDTO } from "../../models/entities/transactions/TransactionsCritereDTO";
import { BaseController } from "../../../../../services/base-classes/src/controllers/base/BaseController";

/**
 * Contr�leur pour l'entit� Transactions
 * @author Controller Generator - 2025-04-01T22:33:48.964Z - Creation
 */
export class TransactionsController extends BaseController<Transactions, TransactionsCritereDTO> {

    override initializeRoutes(): void {
        this.Router.get('/', );
    }

}
