/// <reference types="cypress" />

import { getRandomUser } from "../../generators/userGenerator"
import { BACKEND_URL } from "../../utils/constants"

describe('GET Cart API tests', { env: { snapshotOnly: false } }, () => {
    it('should successfully get cart', () => {
        // given
        const user = getRandomUser()
        cy.register(user)
        cy.login(user.username, user.password)
        
        // when + then
        cy.get('@token').then(token => {
            cy.api({
                method: 'GET',
                url: `${BACKEND_URL}/api/cart`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => {
                expect(resp.status).to.eq(200)
                expect(resp.body).to.have.property('username')
                expect(resp.body).to.have.property('items')
                expect(resp.body).to.have.property('totalPrice')
                expect(resp.body).to.have.property('totalItems')
                expect(resp.body.items).to.be.an('array')
            })
        })
    })

    it('should get 401 without token', () => {
        // when + then
        cy.api({
            method: 'GET',
            url: `${BACKEND_URL}/api/cart`,
            failOnStatusCode: false
        }).then(resp => {
            expect(resp.status).to.eq(401)
        })
    })
}) 