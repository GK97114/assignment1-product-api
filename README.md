# Product API - Microservices

A Node.js, Express-based microservices architecture for product management with separate **Catalog** and **Management** services.

## Architecture

This project implements a **microservices** pattern with two independent services:

### **Catalog Service** (Read-Only)
- Port: `3001`
- Handles product queries and retrieval
- Endpoints:
  - `GET /api/catalog` - Get all products
  - `GET /api/catalog/:id` - Get product by ID

### **Management Service** (Write Operations)
- Port: `3002`
- Handles product creation, updates, and deletion
- Endpoints:
  - `POST /api/products` - Create product
  - `PUT /api/products/:id` - Update product
  - `DELETE /api/products/:id` - Delete product

## Project Structure

```
assignment1-product-api/
│
├── .github/
│   └── workflows/
│       └── ci-cd.yaml          # GitHub Actions CI/CD pipeline
│
├── catalog-service/             # Read-only service (Port 3001)
│   ├── __tests__/               # Jest test suite
│   ├── controller/
│   ├── routes/
│   ├── db/
│   ├── index.js
│   ├── package.json
│   ├── .env
│   ├── jest.config.js
│   └── TESTING.md
│
├── management-service/          # Write operations service (Port 3002)
│   ├── __tests__/               # Jest test suite
│   ├── controller/
│   ├── routes/
│   ├── db/
│   ├── index.js
│   ├── package.json
│   ├── .env
│   ├── jest.config.js
│   └── TESTING.md
│
├── .github/CI-CD.md             # CI/CD documentation
└── README.md                    # This file
```

## Product Schema

Each product contains:
- `id` - Auto-generated integer (primary key)
- `name` - String (required, non-empty)
- `price` - Number (required, non-negative)

## Technology Stack

- **Runtime:** Node.js 18.x / 20.x
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Testing:** Jest + Supertest
- **CI/CD:** GitHub Actions
- **Deployment:** Railway / Cloud Platform

## Setup Instructions

### Prerequisites
- Node.js 18.x or 20.x
- PostgreSQL database
- npm

### 1. Clone Repository
```bash
git clone <repo-url>
cd assignment1-product-api
```

### 2. Setup Catalog Service
```bash
cd catalog-service
npm install
# Update .env with your DATABASE_URL
npm run dev  # Runs on port 3001
```

### 3. Setup Management Service
```bash
cd management-service
npm install
# Update .env with your DATABASE_URL
npm run dev  # Runs on port 3002
```

## Environment Variables

Both services require a `.env` file:

```env
NODE_ENV=development
PORT=3001              # 3002 for management-service
DATABASE_URL=postgresql://user:password@localhost:5432/product_db
RAILWAY_REPLICA_ID=replica-1
```

## Database Setup

### PostgreSQL Schema

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL
);
```

## Testing

### Run Tests Locally

**Catalog Service:**
```bash
cd catalog-service
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

**Management Service:**
```bash
cd management-service
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Coverage Target
- **80%+** across all metrics (branches, functions, lines, statements)
- **Framework:** Jest with Supertest for HTTP testing

See [catalog-service/TESTING.md](catalog-service/TESTING.md) for detailed documentation.

## CI/CD Pipeline

Automated testing via **GitHub Actions**:

### Triggers
- ✅ Every push to `main` branch
- ✅ Every pull request to `main`

### Pipeline Steps
1. Checkout repository
2. Setup Node.js (18.x, 20.x)
3. Install dependencies (both services)
4. Run tests with coverage
5. Upload coverage to Codecov
6. Comment on PRs with results

See [.github/CI-CD.md](.github/CI-CD.md) for complete details.

## API Examples

### Catalog Service

**Get all products:**
```bash
curl http://localhost:3001/api/catalog
```

**Get product by ID:**
```bash
curl http://localhost:3001/api/catalog/1
```

### Management Service

**Create product:**
```bash
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "price": 999.99}'
```

**Update product:**
```bash
curl -X PUT http://localhost:3002/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Laptop", "price": 1099.99}'
```

**Delete product:**
```bash
curl -X DELETE http://localhost:3002/api/products/1
```

## Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes and test locally**
   ```bash
   npm test
   ```

3. **Push to GitHub**
   ```bash
   git push origin feature/new-feature
   ```

4. **Create Pull Request**
   - CI/CD pipeline runs automatically
   - All tests must pass before merging

5. **Merge to Main** when approved

## Microservices Benefits

✅ **Separation of Concerns** - Read and write operations isolated  
✅ **Independent Scaling** - Each service scales independently  
✅ **Technology Flexibility** - Can use different tech per service  
✅ **Easier Testing** - Services tested in isolation  
✅ **Fault Isolation** - Service failures don't cascade  

## Production Workflow

- [x] Initialize project with npm
- [x] Setup Express and PostgreSQL
- [x] Create Catalog Service (read-only)
- [x] Create Management Service (write operations)
- [x] Implement full CRUD endpoints
- [x] Create comprehensive test suite (80%+ coverage)
- [x] Setup GitHub Actions CI/CD pipeline
- [x] Add coverage reporting to Codecov

## Commit Types

Following Conventional Commits syntax:
- `feat` - New feature/functionality
- `fix` - Bug fix
- `chore` - Non-feature changes (build, tooling)
- `docs` - Documentation changes
- `style` - Formatting changes
- `refactor` - Code restructuring without behavior change
- `test` - Add or update tests

## Resources

- [Express.js Docs](https://expressjs.com/)
- [Jest Testing](https://jestjs.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Microservices Architecture](https://microservices.io/)

## License

ISC

## Author

Created as part of SDEV3355 Cloud Computing course.