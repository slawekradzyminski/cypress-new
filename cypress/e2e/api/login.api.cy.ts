
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

    it('should return 400 for invalid body', () => {
        // when + then
        cy.request({
            method: 'POST',
            url: 'http://localhost:4001/users/signin',
            failOnStatusCode: false,
            body: {
                username: 'admin',
                password: '',
            },
        }).then(response => {
            expect(response.status).to.equal(400)
            expect(response.body.password).to.equal('Minimum password length: 4 characters')
        })
    })

    it('should return 422 for invalid body', () => {
        // when + then
        cy.request({
            method: 'POST',
            url: 'http://localhost:4001/users/signin',
            failOnStatusCode: false,
            body: {
                username: 'admin',
                password: 'wrongPassword',
            },
        }).then(response => {
            expect(response.status).to.equal(422)
            expect(response.body.message).to.equal('Invalid username/password supplied')
        })
    })

})
