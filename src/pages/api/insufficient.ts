import { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
//API to help us deal with insufficient funds transactions
// The dfifference with the transaction API is that we set failed to true to differentiate them from succesful ones.

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != 'POST') {
    return res.status(405).json({ status: 405, message: 'Method Not Allowed' });
  }
  try {
    const { transaction } = req.body;
    const totalAmount = transaction.amount * transaction.rate;
    const target_user = await prisma?.user.findFirst({
      where: { email: transaction.to },
      include: {
        account: true,
      },
    });
    const current_user = await prisma?.user.findFirst({
      where: { email: transaction.from },
      include: {
        account: true,
      },
    });
    const failed_target_transaction = await prisma?.trasanction.create({
      data: {
        from: transaction.from,
        to: transaction.to,
        source_currency: transaction.source_currency,
        target_currency: transaction.target_currency,
        rate: transaction.rate,
        amount: totalAmount,
        failed: true,
        createdAt: new Date().toLocaleString('en-US'),
        updatedAt: new Date().toLocaleString('en-US'),
        accountId: target_user?.account?.id || -1,
      },
    });
    const failed_source_transaction = await prisma?.trasanction.create({
      data: {
        from: transaction.from,
        to: transaction.to,
        source_currency: transaction.source_currency,
        target_currency: transaction.target_currency,
        rate: transaction.rate,
        failed: true,
        amount: transaction.amount,
        createdAt: new Date().toLocaleString('en-US'),
        updatedAt: new Date().toLocaleString('en-US'),
        accountId: current_user?.account?.id || -1,
      },
    });

    res
      .status(200)
      .json({ failed_target_transaction, failed_source_transaction });
  } catch (err) {
    res.status(400).json({ status: 400, message: 'Something went wrong' });
  }
};
