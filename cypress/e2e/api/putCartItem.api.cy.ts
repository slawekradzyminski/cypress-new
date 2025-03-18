/// <reference types="cypress" />

import { getRandomUser } from "../../generators/userGenerator"
import { BACKEND_URL } from "../../utils/constants"
import { CartItem } from "../../types/cartItem"

describe('PUT Cart Item API tests', { env: { snapshotOnly: false } }, () => {
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

    it('should successfully update item quantity', () => {
        // given
        const user = getRandomUser()
        cy.register(user)
        cy.login(user.username, user.password)
        const initialQuantity = 1
        const updatedQuantity = 3
        
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
                    quantity: initialQuantity
                }
            }).then(resp => {
                expect(resp.status).to.eq(200)
                expect(resp.body.items.length).to.be.at.least(1)
                
                // Verify the initial quantity
                const addedItem = resp.body.items.find((item: CartItem) => item.productId === productId)
                expect(addedItem).to.exist
                expect(addedItem.quantity).to.eq(initialQuantity)
                
                // when - update the quantity
                cy.api({
                    method: 'PUT',
                    url: `${BACKEND_URL}/api/cart/items/${productId}`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: {
                        quantity: updatedQuantity
                    }
                }).then(resp => {
                    // then
                    expect(resp.status).to.eq(200)
                    
                    // Verify the updated quantity
                    const updatedItem = resp.body.items.find((item: CartItem) => item.productId === productId)
                    expect(updatedItem).to.exist
                    expect(updatedItem.quantity).to.eq(updatedQuantity)
                })
            })
        })
    })

    it('should get 400 with invalid quantity', () => {
        // given
        const user = getRandomUser()
        cy.register(user)
        cy.login(user.username, user.password)
        const initialQuantity = 1
        const invalidQuantity = 0
        
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
                    quantity: initialQuantity
                }
            }).then(resp => {
                expect(resp.status).to.eq(200)
                
                // when + then - try to update with invalid quantity
                cy.api({
                    method: 'PUT',
                    url: `${BACKEND_URL}/api/cart/items/${productId}`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: {
                        quantity: invalidQuantity
                    },
                    failOnStatusCode: false
                }).then(resp => {
                    expect(resp.status).to.eq(400)
                })
            })
        })
    })

    it('should get 401 without token', () => {
        // when + then
        cy.api({
            method: 'PUT',
            url: `${BACKEND_URL}/api/cart/items/${productId}`,
            body: {
                quantity: 2
            },
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
                method: 'PUT',
                url: `${BACKEND_URL}/api/cart/items/${nonExistentProductId}`,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    quantity: 2
                },
                failOnStatusCode: false
            }).then(resp => {
                expect(resp.status).to.eq(404)
            })
        })
    })
}) 