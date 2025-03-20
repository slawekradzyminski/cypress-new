
/// <reference types="cypress" />

import { generateUser } from "../../generators/userGenerator"

describe('Login API POST /users/signin tests', () => {

    it('should successfully login', () => {
        // given
        const user = generateUser()
        cy.register(user)

        // when + then
        cy.login(user.username, user.password)
    })

    it('should return 400 for invalid body', () => {
        // when + then
        cy.api({
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
        cy.api({
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
