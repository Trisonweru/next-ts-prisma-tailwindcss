/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/lib/prisma';
//API to help user to make deposit and add the balance to  the account table.
// We also create a transaction after the depositing in  the transaction tables.

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  //Check if the request type if its post, if not we send status 405 with a message of method not aloowed.
  if (req.method != 'POST') {
    return res.status(405).json({ status: 405, message: 'Method Not Allowed' });
  }
  try {
    //get the input data from the request body.
    const { account } = req.body;

    // find an account related to the current user email in the database
    const accnt = await prisma?.account.findFirst({
      where: { userId: account.user },
    });

    // find an user related to the current user email in the database
    const user = await prisma?.user.findFirst({
      where: { id: account.user },
    });
    //if the current user has no account, we create a account with the account data from request
    //then create a new transaction in the transaction table then send a response to the client side with the created objects.
    //if the user account exixts, update the various balances in the database accordingly then create a transaction
    //and send a response to the cleint
    if (accnt == null) {
      const accountBalance = await prisma?.account.create({
        data: {
          usd_balance: (account.currency == 'USD' && account.amount) || 0,
          eur_balance: (account.currency == 'EUR' && account.amount) || 0,
          ngn_balance: (account.currency == 'NGN' && account.amount) || 0,
          createdAt: new Date().toLocaleString('en-US'),
          updatedAt: new Date().toLocaleString('en-US'),
          user: { connect: { id: account.user } },
        },
      });

      const transaction = await prisma?.trasanction.create({
        data: {
          from: user?.email || '',
          to: user?.email || '',
          amount: account.amount,
          source_currency: account.currency,
          target_currency: account.currency,
          rate: 1,
          accountId: accountBalance?.id || 0,
          createdAt: new Date().toLocaleString('en-US'),
          updatedAt: new Date().toLocaleString('en-US'),
        },
      });
      res.status(200).json({ accountBalance, transaction });
    }
    if (accnt != null) {
      const accountBalance = await prisma?.account.update({
        where: { id: accnt?.id },
        data: {
          usd_balance:
            account.currency == 'USD'
              ? accnt.usd_balance + account.amount
              : accnt.usd_balance,
          eur_balance:
            account.currency == 'EUR'
              ? accnt.eur_balance + account.amount
              : accnt.eur_balance,
          ngn_balance:
            account.currency == 'NGN'
              ? accnt.ngn_balance + account.amount
              : accnt.ngn_balance,
        },
      });
      const transaction = await prisma?.trasanction.create({
        data: {
          from: user?.email || '',
          to: user?.email || '',
          amount: account.amount,
          source_currency: account.currency,
          target_currency: account.currency,
          rate: 1,
          accountId: accnt?.id || 0,
          createdAt: new Date().toLocaleString('en-US'),
          updatedAt: new Date().toLocaleString('en-US'),
        },
      });
      // the
      res.status(200).json({ accountBalance, transaction });
    }
  } catch (err: any) {
    //if any error during the creation proces we catch it and send the error message to the frontend.
    res.status(400).json({ status: 400, message: err.message });
  }
};
