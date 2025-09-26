import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest', // use ts-jest to handle TS + TSX
  testEnvironment: 'jsdom', // needed for React
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // transform TS & TSX files
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // handle "@/..." imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // mock CSS imports
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/tests/playwright/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export default config;
