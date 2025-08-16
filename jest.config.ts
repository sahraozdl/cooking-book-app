import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest', // use ts-jest
  testEnvironment: 'jsdom', // for React
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // transform TS/TSX
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // @/ imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // mock CSS
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // include JSX
  transformIgnorePatterns: ['/node_modules/'], // keep default unless you need to transform ESM modules
};

export default config;
