/// <reference types="cypress" />

import { getRandomUser } from "../../generators/userGenerator"
import { BACKEND_URL } from "../../utils/constants"

describe('DELETE Cart API tests', { env: { snapshotOnly: false } }, () => {
    it('should successfully clear cart', () => {
        // given
        const user = getRandomUser()
        cy.register(user)
        cy.login(user.username, user.password)
        
        // Add an item to cart first
        let productId: number
        
        cy.get('@token').then(token => {
            // First get a product
            cy.api({
                method: 'GET',
                url: `${BACKEND_URL}/api/products`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(resp => {
                expect(resp.status).to.eq(200)
                expect(resp.body).to.be.an('array')
                expect(resp.body.length).to.be.at.least(1)
                productId = resp.body[0].id
                
                // Add item to cart
                cy.api({
                    method: 'POST',
                    url: `${BACKEND_URL}/api/cart/items`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: {
                        productId,
                        quantity: 1
                    }
                }).then(resp => {
                    expect(resp.status).to.eq(200)
                    expect(resp.body.items.length).to.be.at.least(1)
                    
                    // when - clear the cart
                    cy.api({
                        method: 'DELETE',
                        url: `${BACKEND_URL}/api/cart`,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then(resp => {
                        // then
                        expect(resp.status).to.eq(200)
                        
                        // Verify cart is empty
                        cy.api({
                            method: 'GET',
                            url: `${BACKEND_URL}/api/cart`,
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }).then(resp => {
                            expect(resp.status).to.eq(200)
                            expect(resp.body.items).to.be.an('array')
                            expect(resp.body.items.length).to.eq(0)
                            expect(resp.body.totalItems).to.eq(0)
                            expect(resp.body.totalPrice).to.eq(0)
                        })
                    })
                })
            })
        })
    })

    it('should get 401 without token', () => {
        // when + then
        cy.api({
            method: 'DELETE',
            url: `${BACKEND_URL}/api/cart`,
            failOnStatusCode: false
        }).then(resp => {
            expect(resp.status).to.eq(401)
        })
    })
}) 