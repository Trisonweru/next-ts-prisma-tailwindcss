/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import { getSession, GetSessionParams } from 'next-auth/react';
import * as React from 'react';

const prisma = new PrismaClient();

import Card from '@/components/card/Card';
import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.
type props = {
  user: string;
  usd_balance: number;
  eur_balance: number;
  ngn_balance: number;
  transactions: any[];
  account: any[];
};
export default function HomePage({
  user,
  usd_balance,
  eur_balance,
  ngn_balance,
  transactions,
  account,
}: props) {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo templateTitle='Home' />

      <main>
        <section className='bg-white w-full'>
          <Header />
          {/*Pass the props to the card component for display.*/}
          <Card
            user={user}
            usd_balance={usd_balance}
            eur_balance={eur_balance}
            ngn_balance={ngn_balance}
            transactions={transactions}
            account={account}
          />
        </section>
      </main>
    </Layout>
  );
}

export async function getServerSideProps(
  context: GetSessionParams | undefined
) {
  const session = await getSession(context);
  const user = await prisma?.user.findFirst({
    where: { email: session?.user?.email || '' },
  });
  //Find the account with the user in session, include all the transactions from the account.
  const account = await prisma?.account.findFirst({
    where: { userId: user?.id },
    include: { transactions: { orderBy: { id: 'desc' } } },
  });

  //If no session redirect to login page
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  //Send the balances of the account as props to client and the transactions, account, user
  return {
    props: {
      user: session.user?.email,
      usd_balance: account?.usd_balance || 0,
      eur_balance: account?.eur_balance || 0,
      ngn_balance: account?.ngn_balance || 0,
      account: account,
      transactions: account?.transactions || null,
    },
  };
}
