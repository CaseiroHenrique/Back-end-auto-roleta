import { config } from 'dotenv';

config();

import schedule from 'node-schedule';

import { User } from './types/user';
import { Color } from './types';

import { PrismaClient } from '@prisma/client';
import { http } from './lib';

const prisma = new PrismaClient();

export const main = async () => {
  while (true) {
    console.log('start');

    console.log('end - waiting');

    await new Promise((resolve, reject) => setTimeout(resolve, 60 * 1000));
  }
};

async function trigger(user: User, bet: Color) {
  try {
    return await http.post('/bet', { user, bet });
  } catch (err) {
    console.error('Error sending bet:', err);
    return null;
  }
}


schedule.scheduleJob('*/1 * * * *', async () => {
  console.log('running clicle');

  const users = await prisma.user.findMany({
    include: {
      credentials: true,
      config: true,
      bets: true,
      balanceTracks: true,
    },
    where: {
      isActive: true,
    },
  });

  console.log({ users: users.map((user) => user.email) });

    const bets = users.map((user) => trigger(user as User, 'red' as Color));

  await Promise.all(bets);

  console.log('done');
});

