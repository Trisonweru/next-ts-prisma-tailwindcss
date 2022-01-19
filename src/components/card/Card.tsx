import { useRouter } from 'next/router';
import React from 'react';

// importing a utility function to help us format currency values
import { formatter } from '@/utils/fomartter';

type props = {
  user: string;
  usd_balance: number;
  eur_balance: number;
  ngn_balance: number;
  transactions: any[];
  account: any[];
};
function Card({
  usd_balance,
  eur_balance,
  ngn_balance,
  transactions,
  user,
  account,
}: props) {
  const router = useRouter();

  //On New Transaction button click, we push to transaction page
  const newTransaction = () => {
    return router.push('/transaction');
  };

  return (
    <>
      <div className='flex items-center justify-center mt-4 mx-auto'>
        {' '}
        <div className='flex items-center'>
          <h1 className='p-3 text-gray-600 text-sm'>Balance:</h1>
        </div>
        <div className='flex items-center'>
          <h1 className='p-3 text-amber-900 text-sm'>
            {formatter('USD').format(usd_balance)}
          </h1>
        </div>
        <div className='flex items-center'>
          <h1 className='p-3 text-sm text-violet-900'>
            {formatter('EUR').format(eur_balance)}
          </h1>
        </div>
        <div className='flex items-center'>
          <h1 className='p-3 text-cyan-900 text-sm'>
            {formatter('NGN').format(ngn_balance)}
          </h1>
        </div>
      </div>

      <div className='bg-gray-50 flex items-start mt-10'>
        <div className='bg-white flex-1 h-full max-w-5xl mx-auto rounded-lg shadow-xl'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <h1 className='p-3 text-gray-600 text-lg'>Transactions</h1>
            </div>
            <div className='flex items-center'>
              <button
                onClick={newTransaction}
                className='bg-blue-600 border border-transparent duration-150 font-medium leading-5 mx-4 px-4 py-2 rounded-lg text-center text-sm text-white transition-colors w-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-600'
              >
                New Transaction
              </button>
            </div>
          </div>
          {transactions != null ? (
            <div className='flex items-start'>
              <table className='... border border-collapse border-slate-400 mt-4 w-full'>
                <thead>
                  <tr>
                    <th className='... border border-slate-300'>ID</th>
                    <th className='... border border-slate-300'>From</th>
                    <th className='... border border-slate-300'>To</th>
                    <th className='... border border-slate-300'>Value</th>
                    <th className='... border border-slate-300'>Currency</th>
                    <th className='... border border-slate-300'>Created At</th>
                    <th className='... border border-slate-300'>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((item: any, index) => {
                    return (
                      <tr key={item.id}>
                        <td className='... border border-slate-300 p-2 text-base text-gray-700'>
                          <p className='text-gray-700 text-sm'>{index + 1}</p>
                        </td>
                        <td className='... border border-slate-300 p-2 text-base text-gray-700'>
                          <p className='text-gray-700 text-sm'>{item.from}</p>
                        </td>
                        <td className='... border border-slate-300 p-2 text-base text-gray-700'>
                          <p className='text-gray-700 text-sm'>{item.to}</p>
                        </td>
                        <td className='... border border-slate-300 p-2'>
                          <p
                            className={
                              item.failed
                                ? 'text-red-800 text-sm'
                                : 'text-green-600 text-sm'
                            }
                          >
                            {item.to == user
                              ? '+' +
                                formatter(item.target_currency).format(
                                  item.amount
                                )
                              : '-' +
                                formatter(item.source_currency).format(
                                  item.amount
                                )}
                          </p>
                        </td>
                        <td className='... border border-slate-300 p-2'>
                          <p className='text-gray-700 text-sm'>
                            {item.to == user
                              ? item.target_currency
                              : item.source_currency}
                          </p>
                        </td>
                        <td className='... border border-slate-300 p-2'>
                          <p className='text-gray-700 text-sm'>
                            {' '}
                            {item.createdAt}
                          </p>
                        </td>
                        <td className='... border border-slate-300 p-2'>
                          <p className='text-gray-700 text-sm'>
                            {' '}
                            {item.updatedAt}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='flex items-center'>
              <p className='flex m-4 text-center text-gray-700 text-sm'>
                No transactions at the moment
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Card;
