Cypress.Commands.add('register', (user) => {
    cy.api({
        method: 'POST',
        url: 'http://localhost:4001/users/signup',
        body: user
    }).then(response => {
        expect(response.status).to.equal(201)
    })
})

Cypress.Commands.add('login', (username, password) => {
    cy.api({
        method: 'POST',
        url: 'http://localhost:4001/users/signin',
        body: {
            username: username,
            password: password
        }
    }).then(response => {
        expect(response.status).to.equal(200)
        expect(response.body.token).to.not.be.empty
        expect(response.body.token).to.be.a('string')
        cy.wrap(response.body.token).as('token')
    })
})
