import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const { income } = await getRepository(Transaction)
      .createQueryBuilder('transaction')
      .select('SUM(transaction.value)', 'income')
      .where('transaction.type = :type', { type: 'income' })
      .getRawOne();

    const { outcome } = await getRepository(Transaction)
      .createQueryBuilder('transaction')
      .select('SUM(transaction.value)', 'outcome')
      .where('transaction.type = :type', { type: 'outcome' })
      .getRawOne();

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
