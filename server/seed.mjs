import crypto from 'node:crypto';

import { contentSeed } from '../src/data/contentSeed.js';

const defaultSalt = process.env.ADMIN_PASSWORD_SALT || 'df7d01dbbc357a525b100fefac2ab1cb';
const defaultPassword = process.env.ADMIN_PASSWORD || 'PortfolioAdmin123!';

export const adminSeed = {
  username: process.env.ADMIN_USERNAME || 'admin',
  salt: defaultSalt,
  passwordHash: crypto.scryptSync(defaultPassword, defaultSalt, 64).toString('hex'),
  updatedAt: '2026-03-24T00:00:00.000Z',
};

export const analyticsSeed = {
  events: [],
};

export { contentSeed };
