/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import { getSession, GetSessionParams } from 'next-auth/react';
import { useState } from 'react';

import prisma from '@/lib/prisma';

import Seo from '@/components/Seo';

import { fetcher } from '@/utils/fetcher';
type props = {
  userId: number;
  ngn_balance: number;
  eur_balance: number;
  usd_balance: number;
};
export default function Deposit({
  userId,
  ngn_balance,
  eur_balance,
  usd_balance,
}: props) {
  const [amnt, setAmount] = useState(''); //handles amount field value
  const [currency, setCurrency] = useState('USD'); //handles currency field value
  const [amountError, setAmountError] = useState(false); //handles errors on amount field value
  const [error, setError] = useState(false); //hanldes errors from api

  const router = useRouter();

  //handles the deposit button. We check if all values are available and
  //importantly check if its the first deposit.
  //If first deposit, we have to deposit 1000usd and above. After we can deposit any amount.
  const handleDeposit = async (e: any) => {
    e.preventDefault();
    if (currency == 'USD' && usd_balance < 1000 && parseFloat(amnt) < 1000) {
      setAmountError(true);
      setTimeout(() => setAmountError(false), 5000); //display the error to the user then dissapear within 5seconds
      return;
    }
    if (currency == 'EUR' && eur_balance < 1000 && parseFloat(amnt) < 1000) {
      setAmountError(true);
      setTimeout(() => setAmountError(false), 5000); //display the error to the user then dissapear within 5seconds
      return;
    }
    if (currency == 'NGN' && ngn_balance < 1000 && parseFloat(amnt) < 1000) {
      setAmountError(true);
      setTimeout(() => setAmountError(false), 5000); //display the error to the user then dissapear within 5seconds
      return;
    }
    const amount = parseFloat(amnt);
    const body = {
      currency: currency,
      amount: amount,
      user: userId,
    };
    const res = await fetcher('/api/deposit', { account: body }); // using the fetcher utility we send a post request to deposit API
    setAmount('');
    if (res.status == 400) {
      setError(true);
      setTimeout(() => setError(false), 5000); //display the error to the user then dissapear within 5seconds
    }
    //If succesful deposited we redirect to homepage
    if (res.accountBalance) {
      router.push('/');
    }
  };

  return (
    <>
      <Seo templateTitle='Deposit' />
      <div className='bg-gray-50 flex items-center min-h-screen'>
        <div className='bg-white flex-1 h-full max-w-4xl mx-auto rounded-lg shadow-xl'>
          <div className='flex flex-col md:flex-row'>
            <div className='h-32 md:h-auto md:w-1/2'>
              <img
                className='h-full object-cover w-full'
                src='https://source.unsplash.com/user/erondu/1600x900'
                alt='img'
              />
            </div>
            <div className='flex items-center justify-center p-6 sm:p-12 md:w-1/2'>
              <div className='w-full'>
                <div className='flex justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    className='h-10 text-blue-600 w-20'
                    viewBox='0 0 16 16'
                  >
                    <path d='M6 0a.5.5 0 0 1 .5.5V3h3V.5a.5.5 0 0 1 1 0V3h1a.5.5 0 0 1 .5.5v3A3.5 3.5 0 0 1 8.5 10c-.002.434-.01.845-.04 1.22-.041.514-.126 1.003-.317 1.424a2.083 2.083 0 0 1-.97 1.028C6.725 13.9 6.169 14 5.5 14c-.998 0-1.61.33-1.974.718A1.922 1.922 0 0 0 3 16H2c0-.616.232-1.367.797-1.968C3.374 13.42 4.261 13 5.5 13c.581 0 .962-.088 1.218-.219.241-.123.4-.3.514-.55.121-.266.193-.621.23-1.09.027-.34.035-.718.037-1.141A3.5 3.5 0 0 1 4 6.5v-3a.5.5 0 0 1 .5-.5h1V.5A.5.5 0 0 1 6 0zM5 4v2.5A2.5 2.5 0 0 0 7.5 9h1A2.5 2.5 0 0 0 11 6.5V4H5z' />
                  </svg>
                </div>
                <h1 className='font-bold mb-4 mt-4 text-2xl text-center text-gray-700'>
                  Deposit
                </h1>
                {amountError ? (
                  <div className='flex justify-center'>
                    <h1 className='font-regular mb-2 mt-2 text-base text-center text-red-700'>
                      {`Amount should more that ${currency}1000!`}
                    </h1>
                  </div>
                ) : error ? (
                  <div className='flex justify-center'>
                    <h1 className='font-regular mb-2 mt-2 text-base text-center text-red-700'>
                      {'Could not deposit!'}
                    </h1>
                  </div>
                ) : (
                  ''
                )}
                <form method='POST' onSubmit={handleDeposit}>
                  <div>
                    <label className='block mt-4 text-sm'>Currency</label>
                    <select
                      className='border px-4 py-2 rounded-md text-sm w-full focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600'
                      aria-label='Select currency'
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value='USD'>USD</option>
                      <option value='NGN'>NGN</option>
                      <option value='EUR'>EUR</option>
                    </select>
                  </div>
                  <div className='mt-4'>
                    <label className='block text-sm'>Amount</label>
                    <input
                      type='text'
                      className='border px-4 py-2 rounded-md text-sm w-full focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600'
                      placeholder='Amount'
                      value={amnt}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <button
                    type='submit'
                    className='bg-blue-600 block border border-transparent duration-150 font-medium leading-5 mt-4 px-4 py-2 rounded-lg text-center text-sm text-white transition-colors w-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-600'
                  >
                    Deposit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(
  context: GetSessionParams | undefined
) {
  const session = await getSession(context);
  const user = await prisma?.user.findFirst({
    where: { email: session?.user?.email || '' },
  });
  // finding an account with the session usem email to send some
  //account details as props in the last return statement
  const account = await prisma?.account.findFirst({
    where: { userId: user?.id },
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

  return {
    props: {
      session,
      userId: user?.id,
      usd_balance: account?.usd_balance || null,
      eur_balance: account?.eur_balance || null,
      ngn_balance: account?.ngn_balance || null,
    },
  };
}
