
/// <reference types="cypress" />

import { generateUser } from "../../generators/userGenerator"

describe('Register API POST /users/signup tests', () => {

    it('should successfully register', () => {
        // given
        const user = generateUser()

        // when + then
        cy.request({
            method: 'POST',
            url: 'http://localhost:4001/users/signup',
            body: user
        }).then(response => {
            expect(response.status).to.equal(201)
        })
    })

})
