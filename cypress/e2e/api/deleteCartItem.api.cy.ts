/// <reference types="cypress" />

import { getRandomUser } from "../../generators/userGenerator"
import { BACKEND_URL } from "../../utils/constants"
import { CartItem } from "../../types/cartItem"

describe('DELETE Cart Item API tests', { env: { snapshotOnly: false } }, () => {
    let productId: number

    beforeEach(() => {
        // Get a product ID that we can use in tests
        const user = getRandomUser()
        cy.register(user)
        cy.login(user.username, user.password)
        
        cy.get('@token').then(token => {
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
            })
        })
    })

    it('should successfully remove item from cart', () => {
        // given
        const user = getRandomUser()
        cy.register(user)
        cy.login(user.username, user.password)
        
        // Add an item to cart first
        cy.get('@token').then(token => {
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
                
                // when - remove the item from the cart
                cy.api({
                    method: 'DELETE',
                    url: `${BACKEND_URL}/api/cart/items/${productId}`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(resp => {
                    // then
                    expect(resp.status).to.eq(200)
                    
                    // Verify item is removed
                    const itemStillExists = resp.body.items.some((item: CartItem) => item.productId === productId)
                    expect(itemStillExists).to.be.false
                })
            })
        })
    })

    it('should get 401 without token', () => {
        // when + then
        cy.api({
            method: 'DELETE',
            url: `${BACKEND_URL}/api/cart/items/${productId}`,
            failOnStatusCode: false
        }).then(resp => {
            expect(resp.status).to.eq(401)
        })
    })

    it('should get 404 with non-existent product', () => {
        // given
        const user = getRandomUser()
        cy.register(user)
        cy.login(user.username, user.password)
        const nonExistentProductId = 999999
        
        // when + then
        cy.get('@token').then(token => {
            cy.api({
                method: 'DELETE',
                url: `${BACKEND_URL}/api/cart/items/${nonExistentProductId}`,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                failOnStatusCode: false
            }).then(resp => {
                expect(resp.status).to.eq(404)
            })
        })
    })
}) 