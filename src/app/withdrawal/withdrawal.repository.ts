import { EntityRepository, Repository } from 'typeorm';

import { Order } from '../order/order.entity';
import { Withdrawal } from './withdrawal.entity';
import { WithdrawalDto } from './dto/withdrawal.dto';

@EntityRepository(Withdrawal)
export class WithdrawalRepository extends Repository<Withdrawal> {
    async createWithdrawal(withdrawalDto: WithdrawalDto, orders: Order[]) {
        let withdrawal: Withdrawal = this.create();
        withdrawal.admissionCode = withdrawalDto.admissionCode;
        withdrawal.withdrawalCode = withdrawalDto.withdrawalCode;
        withdrawal.orders = orders;
        withdrawal.updatedAt = new Date();
        withdrawal.createdAt = new Date();
        withdrawal = await this.save(withdrawal);
        return this.getWithdrawal(withdrawal.id);
    }

    getWithdrawal(id: string) {
        return this.createQueryBuilder('Withdrawal')
            .select()
            .where('Withdrawal.id = :WithdrawalId', { WithdrawalId: id })
            .leftJoinAndSelect('Withdrawal.orders', 'order')
            .getOne();
    }

    getWithdrawals() {
        return this.createQueryBuilder('withdrawal')
            .select()
            .getMany();
    }

    async deleteWithdrawal(id: string) {
        let withdrawal: Withdrawal = await this.getWithdrawal(id);
        await this.remove(withdrawal);
        return withdrawal;
    }
}
