module.exports = {
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1'
    },
    testEnvironment: 'jsdom',
    moduleDirectories: ['node_modules', '<rootDir>'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
  };