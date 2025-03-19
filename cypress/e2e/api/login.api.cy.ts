
/// <reference types="cypress" />

describe('Login API POST /users/signin tests', () => {

    it('should successfully login', () => {
        // when + then
        cy.request({
            method: 'POST',
            url: 'http://localhost:4001/users/signin',
            body: {
                username: 'admin',
                password: 'admin',
            },
        }).then(response => {
            expect(response.status).to.equal(200)
            expect(response.body.token).to.not.be.empty
            expect(response.body.token).to.be.a('string')
        })
    })

})
