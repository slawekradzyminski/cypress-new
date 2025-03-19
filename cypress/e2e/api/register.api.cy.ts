
/// <reference types="cypress" />

import { generateUser } from "../../generators/userGenerator"

describe('Register API POST /users/signup tests', () => {

    it('should successfully register', () => {
        // given
        const user = generateUser()

        // when + then
        cy.register(user)
    })

    it('should get 400 on too short password', () => {
        // given
        const originalUser = generateUser()
        const user = {
            ...originalUser,
            password: '1234'
        }

        // when + then
        cy.request({
            method: 'POST',
            url: 'http://localhost:4001/users/signup',
            body: user,
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.equal(400)
            expect(response.body.password).to.equal('Minimum password length: 8 characters')
        })
    })

})
