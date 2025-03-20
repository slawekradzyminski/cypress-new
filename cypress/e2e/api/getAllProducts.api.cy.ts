/// <reference types="cypress" />

import { generateUser } from "../../generators/userGenerator"

describe('GET /api/products API tests', () => {

    it('should successfully get products', () => {
        // given
        const user = generateUser()
        cy.register(user)
        cy.login(user.username, user.password)

        // when + then
        cy.get('@token').then(token => {
            cy.api({
                method: 'GET',
                url: 'http://localhost:4001/api/products',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body).to.be.an('array')
                expect(response.body.length).to.be.at.least(5)
            })
        })
    })

    it('should get 401 with invalid jwt token', () => {
        // when + then
        cy.api({
            method: 'GET',
            url: 'http://localhost:4001/api/products',
            headers: {
                Authorization: 'Bearer fakeToken'
            },
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.equal(401)
        })
    })

})
