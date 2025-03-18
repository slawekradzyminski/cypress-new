# Cypress Testing Framework

This project implements a comprehensive testing suite using Cypress for an e-commerce application. The testing framework is structured to provide thorough coverage across API, UI, and UI isolated tests.

## Test Types

### API Tests

API tests directly interact with the backend services without involving the UI. They verify the correct behavior of RESTful endpoints including authentication, authorization, and data manipulation.

#### API Test Approach

- **Direct API Calls**: Uses Cypress's `cy.api()` command for making HTTP requests
- **Authentication**: Tests both authenticated and unauthenticated scenarios
- **Response Validation**: Verifies response status codes, body structure, and data integrity
- **Error Handling**: Tests various error conditions (400, 401, 403, 404, etc.)
- **Test Data Generation**: Uses randomized data to ensure test isolation

#### API Test Organization

API tests are organized in the `cypress/e2e/api` directory with files named according to the endpoint and HTTP method:

- `getProducts.api.cy.ts` - Tests for GET /api/products
- `getCart.api.cy.ts` - Tests for GET /api/cart
- `postCartItems.api.cy.ts` - Tests for POST /api/cart/items
- `putCartItem.api.cy.ts` - Tests for PUT /api/cart/items/{productId}
- `deleteCartItem.api.cy.ts` - Tests for DELETE /api/cart/items/{productId}
- `deleteCart.api.cy.ts` - Tests for DELETE /api/cart

### UI Tests

UI tests verify the application from the user's perspective by interacting with the browser interface. They ensure that UI components, workflows, and integrations function correctly.

#### UI Test Approach

- **Real Browser Interaction**: Tests run in a browser and interact with UI elements
- **Page Object Pattern**: Uses page objects to encapsulate page behavior and selectors
- **Visual Regression**: Checks that components render correctly
- **User Workflows**: Tests complete user journeys such as browsing products, adding to cart, and checkout

#### UI Test Organization

UI tests are organized in the `cypress/e2e/ui` directory with files named according to the page or feature being tested.

### UI Isolated Tests

UI isolated tests (component tests) focus on individual UI components in isolation from the rest of the application.

#### UI Isolated Test Approach

- **Component Mounting**: Tests components in isolation
- **Prop Variation**: Tests components with different props
- **Event Handling**: Verifies component responses to events
- **State Management**: Ensures components manage state correctly

## Testing Methodology

### Given-When-Then Pattern

All tests follow the Given-When-Then (GWT) pattern for clarity and consistency:

```typescript
it('should successfully add item to cart', () => {
    // given
    const user = getRandomUser()
    cy.register(user)
    cy.login(user.username, user.password)
    
    // when + then
    cy.get('@token').then(token => {
        cy.api({
            // test implementation
        }).then(resp => {
            // assertions
        })
    })
})
```

### Test Independence

Each test is designed to be independent and self-contained:

- Tests create their own test data
- Tests handle their own authentication
- Tests clean up after themselves when necessary

### Test Coverage Strategy

- **HTTP Status Codes**: Tests for success (200/201) and failure cases (400, 401, 403, 404)
- **Authorization**: Verifies that protected endpoints require authentication
- **Input Validation**: Tests with valid and invalid inputs
- **Edge Cases**: Tests boundary conditions and special cases

## Custom Commands

The framework leverages custom Cypress commands to encapsulate common operations:

- `cy.register()` - Creates a new user account
- `cy.login()` - Authenticates a user and stores the JWT token
- `cy.api()` - Makes API requests with proper headers

## Test Data Generation

The framework uses faker.js through the `userGenerator.ts` module to create randomized test data, ensuring tests don't interfere with each other and can be run repeatedly.

## Project Structure

```
cypress/
├── e2e/
│   ├── api/          # API tests
│   └── ui/           # UI tests
├── fixtures/         # Test data files
├── generators/       # Test data generators
├── pages/            # Page objects for UI tests
├── support/          # Support files, custom commands
│   ├── commands.ts   # Custom Cypress commands
│   └── e2e.ts        # Support file loaded before tests
├── types/            # TypeScript type definitions
└── utils/            # Utility functions and constants
```

## Running Tests

### API Tests

```bash
# Run all API tests
npx cypress run --spec "cypress/e2e/api/**/*.cy.ts"

# Run specific API test file
npx cypress run --spec "cypress/e2e/api/getCart.api.cy.ts"
```

### UI Tests

```bash
# Run all UI tests
npx cypress run --spec "cypress/e2e/ui/**/*.cy.ts"

# Run specific UI test file
npx cypress run --spec "cypress/e2e/ui/cart.cy.ts"
```

### All Tests

```bash
# Run all tests
npx cypress run
```

## Continuous Integration

This testing framework is designed to run in CI environments. The tests are organized to be:

- Fast: Tests run in parallel when possible
- Reliable: Tests don't depend on each other
- Informative: Tests provide clear failure messages

## Best Practices

This project follows these testing best practices:

1. **Explicit Assertions**: All tests have explicit assertions
2. **Response Ordering**: API tests are ordered by response code (200 → 400 → 401 → 403 → 404)
3. **Minimal Test Code**: Tests include only the necessary code
4. **Consistent Naming**: Tests follow a consistent naming convention
5. **TypeScript**: Uses TypeScript for type safety
6. **Clean Test Data**: Tests create and manage their own test data 