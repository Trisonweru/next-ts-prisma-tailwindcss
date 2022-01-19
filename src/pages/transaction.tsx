/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import { useRouter } from 'next/router';
import { getSession, GetSessionParams } from 'next-auth/react';
import { useState } from 'react';

const prisma = new PrismaClient();

import Seo from '@/components/Seo';

import { fetcher } from '@/utils/fetcher';
import { formatter } from '@/utils/fomartter';
type props = {
  user: string;
  accounts: any[];
  account: any[];
  rates: any;
};
export default function Transaction({ user, accounts, account, rates }: props) {
  const [value, setValue] = useState(''); //handles value field value
  const [currency, setCurrency] = useState('USD'); //handles currency field value
  const [to, setTo] = useState(''); //handles to field value
  const [toError, setToError] = useState(false); //handles to error
  const [currencyError, setCurrencyError] = useState(false); //handles currency error
  const [valueError, setValueError] = useState(false); //handles value error
  const [insufficient, setInsufficientError] = useState(false); //handles insufficient balance error
  const router = useRouter();
  let rate: any | undefined = 0;
  //get rate value based on the selected currency.
  Object.entries(rates).map(([key, val]) => {
    if (key == currency) {
      rate = val;
      return;
    }
  });
  //request body to send to backend
  const body = {
    from: user,
    to: to,
    source_currency: 'USD',
    target_currency: currency,
    rate: rate,
    amount: parseFloat(value),
    createdAt: new Date().toLocaleString('en-US'),
    updatedAt: new Date().toLocaleString('en-US'),
  };

  //Checks all values are present before sending a request.
  const transctionHandler = async (e: any) => {
    e.preventDefault();
    if (value == '') {
      setValueError(true);
      setTimeout(() => setValueError(false), 5000);
    }
    if (currency == '') {
      setCurrencyError(true);
      setTimeout(() => setCurrencyError(false), 5000);
    }

    if (currency == '') {
      setToError(true);
      setTimeout(() => setToError(false), 5000);
    }
    //If the input value is higher than the account balance, we send a request insufficient API
    // which will record an insufficient funds transaction for both ends.
    if (parseFloat(value) > account[0].usd_balance) {
      setInsufficientError(true);
      setTimeout(() => setInsufficientError(false), 5000);
      await fetcher('/api/insufficient', { transaction: body });
    }

    //If everything is right, we send the request to transaction API which records and update both accounts(source and target)
    if (value && currency && to && parseFloat(value) < account[0].usd_balance) {
      const res = await fetcher('/api/transaction', { transaction: body });
      if (res.target_Balance) {
        router.push('/');
      }
    }
  };
  const handleCurrency = async (e: any) => {
    setCurrency(e.target.value);
  };

  return (
    <>
      <Seo templateTitle='New Transaction' />
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
                  New Transaction
                </h1>
                <h1 className='font-bold mb-4 mt-4 text-amber-900 text-center text-sm'>
                  Balance: {formatter('USD').format(account[0].usd_balance)}
                </h1>
                {valueError ? (
                  <div className='flex justify-center'>
                    <h1 className='font-regular mb-2 mt-2 text-base text-center text-red-700'>
                      {`Amount field cannot be empty`}
                    </h1>
                  </div>
                ) : currencyError ? (
                  <div className='flex justify-center'>
                    <h1 className='font-regular mb-2 mt-2 text-base text-center text-red-700'>
                      {`Specify the target currency`}
                    </h1>
                  </div>
                ) : toError ? (
                  <div className='flex justify-center'>
                    <h1 className='font-regular mb-2 mt-2 text-base text-center text-red-700'>
                      {`To field cannot be empty`}
                    </h1>
                  </div>
                ) : insufficient ? (
                  <div className='flex justify-center'>
                    <h1 className='font-regular mb-2 mt-2 text-base text-center text-red-700'>
                      {`Insufficient funds in your USD account`}
                    </h1>
                  </div>
                ) : (
                  ''
                )}
                <form method='POST' onSubmit={transctionHandler}>
                  <div className='mt-4'>
                    <label className='block text-sm'>To</label>
                    <select
                      className='border px-4 py-2 rounded-md text-sm w-full focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600'
                      aria-label='Default select example'
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    >
                      <option selected>Select an email</option>
                      {accounts.map((item: any, index: number) => {
                        return (
                          <option key={index} value={item.user.email}>
                            {item.user.email}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className='block mt-4 text-sm'>
                      Target currency
                    </label>
                    <select
                      className='border px-4 py-2 rounded-md text-sm w-full focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600'
                      aria-label='Select currency'
                      value={currency}
                      onChange={handleCurrency}
                    >
                      <option value='USD'>USD</option>
                      <option value='NGN'>NGN</option>
                      <option value='EUR'>EUR</option>
                    </select>
                  </div>
                  <div>
                    <label className='block mt-4 text-sm'>Exchange rate</label>
                    {Object.entries(rates).map(([key, val], index) => {
                      if (key == currency) {
                        return (
                          <p key={index}>{`1USD ---> ${val}${currency}`}</p>
                        );
                      }
                    })}
                  </div>
                  <div>
                    <label className='block mt-4 text-sm'>Amount</label>
                    <input
                      className='border px-4 py-2 rounded-md text-sm w-full focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600'
                      placeholder='Amount'
                      type='text'
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>
                  <button
                    type='submit'
                    className='bg-blue-600 block border border-transparent duration-150 font-medium leading-5 mt-4 px-4 py-2 rounded-lg text-center text-sm text-white transition-colors w-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-600'
                  >
                    Transact
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
  const accounts = await prisma?.account.findMany({
    include: { user: true },
  });
  const data: any[] = [];
  const userAccount: any[] = [];

  //iterate through all accounts
  accounts?.map((item: { user: { email: string | null | undefined } }) => {
    if (item.user.email != session?.user?.email) {
      return data.push(item);
    }
    return userAccount.push(item);
  });
  //Get exchange rates from an API and pass the rates as props
  const currencyX = await fetch(
    'https://currencyapi.net/api/v1/rates?key=cODY6IzQza9mDdHrhpTBn4j8tx5XHVXGflLD&output=JSON'
  );
  const currency_data = await currencyX.json();
  //redirect to login if no session
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  //if usd account balance is less than 1000, redirect to deposit
  if (
    userAccount[0]?.usd_balance < 1000 ||
    userAccount[0]?.usd_balance == undefined
  ) {
    return {
      redirect: {
        destination: '/deposit',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user?.email,
      accounts: data,
      rates: currency_data.rates || null,
      account: userAccount,
    },
  };
}
