import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import NextAuth from 'next-auth/next';
import CredentialProvider from 'next-auth/providers/credentials';

const prisma = new PrismaClient();

//We use next-auth package to authenicate our user using session and token.
//With auth-next we use the credential API which receives credentials from sign in page.
//We use bcrypt library to compare encrypted password from the database.
export default NextAuth({
  providers: [
    CredentialProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'johndoe@gmail.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      authorize: async (credentials) => {
        //Find the user with the email from credentials
        const user = await prisma?.user.findFirst({
          where: { email: credentials?.email },
        });
        // throw an error if no user is found.
        if (!user) {
          throw new Error('User not found');
        }
        // if user we vrify the password hash if they match.
        const verified = await bcrypt.compareSync(
          credentials?.password || '',
          user.password
        );
        //If doesn't match we throw an error
        if (!verified) {
          throw new Error("Password doesn't match.");
        }
        //else we retur the user details as JSON data
        return { id: user.updatedAt, email: user.email };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session: ({ session, user }) => {
      if (user) {
        session.id = user.id;
      }
      return Promise.resolve(session);
    },
  },
  secret: 'moneywireapp2022',
  jwt: {
    secret: 'moneywireapp2022',
  },
  //register our sign in page to get credetials from
  pages: {
    signIn: '/login',
  },
});
