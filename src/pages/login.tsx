/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import { getSession, GetSessionParams, signIn } from 'next-auth/react';
import { useState } from 'react';

import prisma from '@/lib/prisma';

import Seo from '@/components/Seo';

export default function Signin() {
  const [email, setEmail] = useState(''); //handles email field value
  const [password, setPassword] = useState(''); //handles password field value
  const [emailError, setEmailError] = useState(false); //handles email field error
  const [passError, setPassError] = useState(false); //handles password field error
  const [error, setError] = useState(false); //hanldes errors from api

  const router = useRouter();
  //check if we have all the credential then send a reuest with the creditials to auth-next signIn method
  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (email == '') {
      setEmailError(true);
      setTimeout(() => setEmailError(false), 5000); //display the error to the user then dissapear within 5seconds
    }
    if (password == '') {
      setPassError(true);
      setTimeout(() => setPassError(false), 5000); //display the error to the user then dissapear within 5seconds
    }
    if (email != '' && password != '') {
      const res: any | undefined = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
        callbackUrl: `${window.location.origin}`,
      });
      if (res?.url) {
        router.replace(res?.url);
      }
      if (res?.status == 401) {
        setError(true);
        setTimeout(() => setError(false), 5000); //display the error to the user then dissapear within 5seconds
      }
    }
  };

  return (
    <>
      <Seo templateTitle='Login' />
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
                  Sign in
                </h1>
                {emailError ? (
                  <div className='flex justify-center'>
                    <h1 className='font-regular mb-2 mt-2 text-base text-center text-red-700'>
                      {'Email field cannot be empty!'}
                    </h1>
                  </div>
                ) : passError ? (
                  <div className='flex justify-center'>
                    <h1 className='font-regular mb-2 mt-2 text-base text-center text-red-700'>
                      {'Password field cannot be empty!'}
                    </h1>
                  </div>
                ) : error ? (
                  <div className='flex justify-center'>
                    <h1 className='font-regular mb-2 mt-2 text-base text-center text-red-700'>
                      {'Email/Password incorrect!'}
                    </h1>
                  </div>
                ) : (
                  ''
                )}
                <form method='POST' onSubmit={handleLogin}>
                  <div className='mt-4'>
                    <label className='block text-sm'>Email</label>
                    <input
                      type='email'
                      className='border px-4 py-2 rounded-md text-sm w-full focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600'
                      placeholder='Email Address'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className='block mt-4 text-sm'>Password</label>
                    <input
                      className='border px-4 py-2 rounded-md text-sm w-full focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600'
                      placeholder='Password'
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type='submit'
                    className='bg-blue-600 block border border-transparent duration-150 font-medium leading-5 mt-4 px-4 py-2 rounded-lg text-center text-sm text-white transition-colors w-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue active:bg-blue-600'
                  >
                    Sign in
                  </button>
                </form>

                <div className='mt-4 text-center'>
                  <p className='text-sm'>
                    {"Don't have an account? "}
                    <a href='/signup' className='text-blue-600 hover:underline'>
                      {' '}
                      Sign up.
                    </a>
                  </p>
                </div>
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
  const session = await getSession(context); // get the session
  const user = await prisma?.user.findFirst({
    where: { email: session?.user?.email || '' },
  });
  // find the account with the session user,
  const account: any | undefined = await prisma?.account.findFirst({
    where: { userId: user?.id },
  });

  // then redirect to deposit page if thy have less than 1000 balance.
  //else redict to home page.
  if (session && account[0]?.usd_balance > 1000) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  if (session && account[0]?.usd_balance < 1000) {
    return {
      redirect: {
        destination: '/deposit',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
