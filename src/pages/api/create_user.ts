import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

//An API to help create a user when they sign up.

const saltRounds = 10;
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  //Check if the request type if its post, if not we send status 405 with a message of method not aloowed.
  if (req.method != 'POST') {
    return res.status(405).json({ status: 405, message: 'Method Not Allowed' });
  }
  // if user, we create the user in the database using prisma create function.
  try {
    const { user } = req.body;
    const hash = await bcrypt.hashSync(user.password, saltRounds);
    const current = {
      name: user.name,
      email: user.email,
      password: hash,
      createdAt: new Date().toLocaleString('en-US'),
      updatedAt: new Date().toLocaleString('en-US'),
    };
    const savedUser = await prisma?.user.create({
      data: current,
    });
    //we send a 200 code status on creatin succesful with the saved user object.
    res.status(200).json(savedUser);
  } catch (err) {
    //if any error during the creation proces we catch it and send the error message to the frontend.
    res.status(400).json({ status: 400, message: 'Something went wrong' });
  }
};
