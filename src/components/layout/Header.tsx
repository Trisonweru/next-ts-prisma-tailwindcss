import Link from 'next/link';
import { signOut } from 'next-auth/react';
import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

export default function Header() {
  return (
    <header className='bg-white shadow-lg sticky top-0 z-50'>
      <div className='flex h-14 items-center justify-between layout'>
        <UnstyledLink href='/' className='font-bold hover:text-gray-600'>
          MoneyWire
        </UnstyledLink>
        <nav>
          <ul className='flex items-center justify-between space-x-4'>
            <UnstyledLink
              href='/deposit'
              className='font-bold hover:text-gray-600'
            >
              Deposit
            </UnstyledLink>
            <Link href='/'>
              <a
                href=''
                className='font-bold hover:text-gray-600'
                onClick={() => signOut()}
              >
                Sign out
              </a>
            </Link>
          </ul>
        </nav>
      </div>
    </header>
  );
}
