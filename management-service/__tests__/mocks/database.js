// Mock database pool for testing
const mockPool = {
  query: jest.fn(),
  connect: jest.fn().mockResolvedValue({
    release: jest.fn(),
  }),
};

module.exports = mockPool;
