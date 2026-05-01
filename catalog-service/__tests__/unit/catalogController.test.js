jest.mock('../../db/database', () => require('../mocks/database'));

const mockPool = require('../mocks/database');
const { getAllProducts, getProductById } = require('../../controller/catalogController');

describe('Catalog Controller - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products successfully', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 10.99 },
        { id: 2, name: 'Product 2', price: 20.99 },
      ];

      mockPool.query.mockResolvedValue({ rows: mockProducts });

      const req = {};
      const res = {
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await getAllProducts(req, res);

      expect(mockPool.query).toHaveBeenCalledWith('SELECT * FROM products');
      expect(res.json).toHaveBeenCalledWith({
        service: 'catalog',
        replicaId: 'test-replica-1',
        products: mockProducts,
      });
    });

    it('should return error when database query fails', async () => {
      const mockError = new Error('Database connection failed');
      mockPool.query.mockRejectedValue(mockError);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch products' });
    });

    it('should return empty array when no products exist', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const req = {};
      const res = {
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await getAllProducts(req, res);

      expect(res.json).toHaveBeenCalledWith({
        service: 'catalog',
        replicaId: 'test-replica-1',
        products: [],
      });
    });
  });

  describe('getProductById', () => {
    it('should return a single product by ID', async () => {
      const mockProduct = { id: 1, name: 'Product 1', price: 10.99 };
      mockPool.query.mockResolvedValue({ rows: [mockProduct] });

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await getProductById(req, res);

      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM products WHERE id = $1',
        ['1']
      );
      expect(res.json).toHaveBeenCalledWith({
        service: 'catalog',
        replicaId: 'test-replica-1',
        product: mockProduct,
      });
    });

    it('should return 404 when product not found', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const req = { params: { id: '999' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    it('should return 400 when ID is invalid', async () => {
      const req = { params: { id: 'invalid' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Product ID must be a valid number',
      });
    });

    it('should return error when database query fails', async () => {
      const mockError = new Error('Database connection failed');
      mockPool.query.mockRejectedValue(mockError);

      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch product' });
    });
  });
});
