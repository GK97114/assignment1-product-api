# CI/CD Pipeline Documentation

## Overview
This GitHub Actions workflow automatically runs tests whenever you push to `main` or create a pull request. It tests both the **Catalog Service** and **Management Service**.

## Workflow File
Location: `.github/workflows/ci-cd.yaml`

## Triggers

The pipeline runs on:
1. **Push to `main` branch** - Automatically tests every commit
2. **Pull requests to `main`** - Tests before merging

## What the Pipeline Does

### 1. **Checkout Repository**
   - Downloads your code from GitHub

### 2. **Setup Node.js**
   - Installs Node.js (tests on versions 18.x and 20.x)
   - Caches npm dependencies for faster builds

### 3. **Install & Test Catalog Service**
   ```bash
   cd catalog-service
   npm install
   npm test -- --coverage
   ```
   - Installs dependencies
   - Runs all tests
   - Generates coverage report

### 4. **Install & Test Management Service**
   ```bash
   cd management-service
   npm install
   npm test -- --coverage
   ```
   - Installs dependencies
   - Runs all tests
   - Generates coverage report

### 5. **Upload Coverage Reports**
   - Uploads test coverage to **Codecov**
   - Helps track code coverage over time
   - Creates visual reports on each commit

### 6. **PR Comments**
   - Comments on pull requests with test status
   - ✅ Passes or ❌ Fails

## How to Use

### Push to Main
```bash
git add .
git commit -m "Your changes"
git push origin main
```
✅ Pipeline runs automatically on GitHub

### Create a Pull Request
```bash
git checkout -b feature/my-feature
git add .
git commit -m "My feature"
git push origin feature/my-feature
```
Then create a PR on GitHub → Pipeline runs automatically

## Viewing Results

### GitHub Actions Tab
1. Go to your repository on GitHub
2. Click **Actions** tab
3. See workflow runs and logs

### Pull Request
- Click the **Checks** tab on your PR
- See real-time test status
- Click **Details** to view full logs

### Coverage Reports
- Go to **[Codecov.io](https://codecov.io)**
- Connect your GitHub account
- See coverage trends and reports

## Configuration

### Node.js Versions
Currently tests on: `18.x` and `20.x`

To add more versions, edit `.github/workflows/ci-cd.yaml`:
```yaml
matrix:
  node-version: [16.x, 18.x, 20.x]  # Add 16.x
```

### Test Coverage Threshold
Both services have 80% coverage requirements in `jest.config.js`:
```js
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}
```

If coverage falls below 80%, tests will fail.

### Codecov (Optional)
If you want to track coverage over time:
1. Go to **[Codecov.io](https://codecov.io)**
2. Sign in with GitHub
3. Enable your repository
4. Coverage reports will auto-upload on each push

## Troubleshooting

### Pipeline Fails
1. Click **Actions** → See which step failed
2. Click **Details** → Read error message
3. Common issues:
   - Missing dependencies: Run `npm install` locally
   - Test failures: Run `npm test` locally to debug
   - Coverage below 80%: Add more tests

### Force Re-run
Go to **Actions** → Click workflow run → **Re-run jobs**

### Disable Workflow
Edit `.github/workflows/ci-cd.yaml` and change:
```yaml
on:
  push:
    branches: []  # Empty array disables it
```

## Status Badge

Add this to your `README.md` to show pipeline status:
```markdown
[![CI/CD Pipeline](https://github.com/YOUR-USERNAME/assignment1-product-api/actions/workflows/ci-cd.yaml/badge.svg)](https://github.com/YOUR-USERNAME/assignment1-product-api/actions)
```

Replace `YOUR-USERNAME` with your GitHub username.

## Best Practices

1. **Always push to a feature branch** → Create PR → Wait for tests → Merge
2. **Keep tests passing** before merging to main
3. **Monitor coverage** to maintain 80%+ threshold
4. **Review logs** if tests fail
5. **Update tests** when adding new features

## Example Workflow

```
1. Create feature branch
   git checkout -b feature/new-endpoint

2. Make changes & test locally
   npm test

3. Push to GitHub
   git push origin feature/new-endpoint

4. Create PR
   GitHub → "Compare & pull request"

5. Pipeline runs automatically
   Tests on Node 18.x and 20.x

6. If all pass → ✅ Ready to merge
   If fails → ❌ Fix issues → Push again

7. Merge to main
   GitHub → "Squash and merge"

8. Delete feature branch
   GitHub → Cleanup
```

## Files Modified/Created

- `.github/workflows/ci-cd.yaml` - Main workflow file
- `catalog-service/jest.config.js` - Test configuration
- `management-service/jest.config.js` - Test configuration
- `catalog-service/package.json` - Test scripts
- `management-service/package.json` - Test scripts
