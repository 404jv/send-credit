import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendCreditUseCase } from "./SendCreditUseCase";

class SendCreditController {
  async execute(request: Request, response: Response) {
    const { id: senderUserId } = request.user;
    const { amount, description } = request.body;
    const { user_id: recipientUserId } = request.params;

    const sendCreditUseCase = container.resolve(SendCreditUseCase);
    await sendCreditUseCase.execute({
      amount,
      description,
      recipientUserId,
      senderUserId,
    });

    return response.send();
  }
}

export { SendCreditController };
