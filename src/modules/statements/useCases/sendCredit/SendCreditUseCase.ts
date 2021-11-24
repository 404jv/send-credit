import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";

interface IRequest {
  senderUserId: string;
  recipientUserId: string;
  amount: number;
  description: string;
}

@injectable()
class SendCreditUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  )  {}

  async execute({ amount, description, recipientUserId, senderUserId }: IRequest) {
    const senderUser = await this.usersRepository.findById(senderUserId);
    if (!senderUser) {
      throw new AppError('Sender not found', 404);
    }

    const recipientUser = await this.usersRepository.findById(recipientUserId);
    if (!recipientUser) {
      throw new AppError('Recipient not found', 404);
    }

    const senderUserBalance = await this.statementsRepository.getUserBalance({
      user_id: senderUserId,
      with_statement: false,
    });

    if (senderUserBalance.balance < amount) {
      throw new AppError(`User sender does not have $${amount}`, 400);
    }

    this.removeCreditStatement(
      recipientUserId,
      senderUserId,
      amount,
      description
    )
  }

  private removeCreditStatement(user_id: string, sender_id: string, amount: number, description: string) {
    this.statementsRepository.create({
      user_id,
      sender_id,
      amount,
      description,
      type: OperationType.TRANSFER,
    });
  }
}

export { SendCreditUseCase };
