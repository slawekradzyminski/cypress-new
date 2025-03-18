export const productMocks = {

    mockSuccess: () => {
        cy.intercept('GET', '**/api/products', {
            statusCode: 200,
            fixture: 'products.json'
        })
    }

}