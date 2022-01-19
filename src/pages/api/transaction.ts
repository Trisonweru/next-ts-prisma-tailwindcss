/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/lib/prisma';

//API that helps with creating a transactiona and updating account balance.
//When a user clicks on transact, we deduct the transaction amount from user account
//and add it to the target account while creating transactions at both ends.

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != 'POST') {
    return res.status(405).json({ status: 405, message: 'Method Not Allowed' });
  }
  try {
    const { transaction } = req.body;
    const target_user: any | undefined = await prisma?.user.findFirst({
      where: { email: transaction.to },
      include: {
        account: true,
      },
    });
    const current_user: any | undefined = await prisma?.user.findFirst({
      where: { email: transaction.from },
      include: {
        account: true,
      },
    });
    const totalAmount = transaction.amount * transaction.rate;
    const target_Balance = await prisma?.account.update({
      where: { id: target_user?.account?.id },
      data: {
        usd_balance:
          transaction.target_currency == 'USD'
            ? target_user?.account?.usd_balance + totalAmount
            : target_user?.account?.usd_balance,
        eur_balance:
          transaction.target_currency == 'EUR'
            ? target_user?.account?.eur_balance + totalAmount
            : target_user?.account?.eur_balance,
        ngn_balance:
          transaction.target_currency == 'NGN'
            ? target_user?.account?.ngn_balance + totalAmount
            : target_user?.account?.ngn_balance,
      },
    });

    const current_Balance = await prisma?.account.update({
      where: { id: current_user?.account?.id },
      data: {
        usd_balance: current_user?.account?.usd_balance - transaction.amount,
      },
    });

    const target_transaction = await prisma?.trasanction.create({
      data: {
        from: transaction.from,
        to: transaction.to,
        source_currency: transaction.source_currency,
        target_currency: transaction.target_currency,
        rate: transaction.rate,
        amount: totalAmount,
        createdAt: new Date().toLocaleString('en-US'),
        updatedAt: new Date().toLocaleString('en-US'),
        accountId: target_user?.account?.id || 0,
      },
    });
    const source_transaction = await prisma?.trasanction.create({
      data: {
        from: transaction.from,
        to: transaction.to,
        source_currency: transaction.source_currency,
        target_currency: transaction.target_currency,
        rate: transaction.rate,
        amount: transaction.amount,
        createdAt: new Date().toLocaleString('en-US'),
        updatedAt: new Date().toLocaleString('en-US'),
        accountId: current_user?.account?.id || 0,
      },
    });
    res.status(200).json({
      target_Balance,
      current_Balance,
      target_transaction,
      source_transaction,
    });
  } catch (err: any) {
    res.status(400).json({ status: 400, message: err.message });
  }
};
