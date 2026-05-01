# Testing Suite Documentation

## Overview
This testing suite uses **Jest** with **Supertest** for HTTP testing. It includes:
- **Unit Tests**: Test individual controller functions
- **Integration Tests**: Test API routes end-to-end
- **Coverage Target**: 80%+ for all metrics (branches, functions, lines, statements)

## Running Tests

### Run all tests
```bash
npm test
```

### Watch mode (re-run on file changes)
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:coverage
```

## Test Structure

### Management Service (`__tests__/`)
```
__tests__/
├── mocks/
│   └── database.js          # Mock PostgreSQL pool
├── unit/
│   └── managementController.test.js
└── integration/
    └── managementRoutes.test.js
```

## Test Types

### Unit Tests
Test individual functions in isolation with mocked dependencies:
- `createProduct()` - Create new product
- `updateProduct()` - Update existing product
- `deleteProduct()` - Delete product

### Integration Tests
Test complete API routes using Supertest:
- HTTP status codes
- Request/response payloads
- Error handling
- Database interaction (mocked)

## Configuration

Jest configuration in `jest.config.js`:
- **Test Environment**: Node.js
- **Coverage Paths**: `controller/`, `routes/`, `db/` (excludes test files)
- **Coverage Threshold**: 80% for all metrics
- **Test Match Pattern**: `**/__tests__/**/*.test.js`

## Best Practices

1. **Always run tests before committing**
   ```bash
   npm test
   ```

2. **Aim for 80%+ coverage**
   ```bash
   npm run test:coverage
   ```

3. **Mock external dependencies** (database, APIs)
   - Use `jest.mock()` at the top of test files
   - Keep mocks in `__tests__/mocks/`

4. **Test edge cases and error scenarios**
   - Invalid input validation
   - Database failures
   - Missing resources (404s)
   - Unauthorized access (401s)

5. **Keep tests isolated**
   - Use `beforeEach()` to reset mocks
   - Don't depend on test execution order
   - One test = one assertion (when possible)

## CI/CD Integration

These tests are designed to run in CI/CD pipelines:
- **GitHub Actions**: Run `npm test` in workflow
- **GitLab CI**: Add test job to `.gitlab-ci.yml`
- **Jenkins**: Execute `npm test` in build stage
- **Docker**: Include test command in build

Example GitHub Actions workflow:
```yaml
- name: Run tests
  run: npm test

- name: Check coverage
  run: npm run test:coverage
```

## Debugging Tests

### Run a single test file
```bash
npm test -- __tests__/unit/managementController.test.js
```

### Run tests matching a pattern
```bash
npm test -- createProduct
```

### Enable verbose output
```bash
npm test -- --verbose
```

### Update snapshots (if using snapshot testing)
```bash
npm test -- -u
```

## Troubleshooting

### Tests not running
- Ensure `jest.config.js` exists in service root
- Check that test files match pattern: `*.test.js`
- Verify `__tests__` directory structure

### Mock not working
- Import mock before the actual module
- Use `jest.mock()` at the very top of the test file
- Clear mocks in `beforeEach()`: `jest.clearAllMocks()`

### Coverage not meeting threshold
- Run `npm run test:coverage` to see detailed report
- Add tests for untested branches
- Check `coverage/` directory HTML report

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://jestjs.io/docs/getting-started)
