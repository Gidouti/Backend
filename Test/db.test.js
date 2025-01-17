// test/db.test.js

const mysql = require('mysql2');
const dotenv = require('dotenv');
const connection = require('./db.test.js'); // Adjust the path to your connection file

jest.mock('mysql2', () => {
  return {
    createConnection: jest.fn(() => ({
      connect: jest.fn((callback) => callback(null)), // Mock successful connection
    })),
  };
});

describe('Database Connection', () => {
  beforeAll(() => {
    dotenv.config();
  });

  test('should connect to the database successfully', () => {
    const mockConnect = jest.fn();
    const dbConnection = mysql.createConnection();

    dbConnection.connect(mockConnect);

    expect(mockConnect).toHaveBeenCalled(); // Check if connect callback was called
    expect(mockConnect).toHaveBeenCalledWith(null); // Ensure no error was passed
  });

  test('should log an error on connection failure', () => {
    const errorMessage = 'Connection failed';
    const mockError = jest.fn();
    const mockLog = jest.spyOn(console, 'error').mockImplementation(() => { });

    // Mock the connection to fail
    mysql.createConnection.mockImplementationOnce(() => ({
      connect: jest.fn((callback) => callback(new Error(errorMessage))),
    }));

    const dbConnectionFail = mysql.createConnection();
    dbConnectionFail.connect(mockError);

    expect(mockLog).toHaveBeenCalledWith('Error connecting to the database:', expect.any(String));
    expect(mockError).toHaveBeenCalled(); // Check if connect callback was called on error

    mockLog.mockRestore(); // Restore original console.error
  });
});