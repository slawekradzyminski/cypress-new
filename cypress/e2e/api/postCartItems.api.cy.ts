/// <reference types="cypress" />

import { getRandomUser } from "../../generators/userGenerator"
import { BACKEND_URL } from "../../utils/constants"
import { CartItem } from "../../types/cartItem"

describe('POST Cart Items API tests', { env: { snapshotOnly: false } }, () => {
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

    it('should successfully add item to cart', () => {
        // given
        const user = getRandomUser()
        cy.register(user)
        cy.login(user.username, user.password)
        const quantity = 2

        // when + then
        cy.get('@token').then(token => {
            cy.api({
                method: 'POST',
                url: `${BACKEND_URL}/api/cart/items`,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    productId,
                    quantity
                }
            }).then(resp => {
                expect(resp.status).to.eq(200)
                expect(resp.body).to.have.property('items')
                expect(resp.body.items).to.be.an('array')
                
                // Find the added item in cart items
                const addedItem = resp.body.items.find((item: CartItem) => item.productId === productId)
                expect(addedItem).to.exist
                expect(addedItem.quantity).to.eq(quantity)
                
                expect(resp.body).to.have.property('totalPrice')
                expect(resp.body).to.have.property('totalItems')
                expect(resp.body.totalItems).to.be.at.least(1)
            })
        })
    })

    it('should get 400 with invalid quantity', () => {
        // given
        const user = getRandomUser()
        cy.register(user)
        cy.login(user.username, user.password)
        const invalidQuantity = 0

        // when + then
        cy.get('@token').then(token => {
            cy.api({
                method: 'POST',
                url: `${BACKEND_URL}/api/cart/items`,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    productId,
                    quantity: invalidQuantity
                },
                failOnStatusCode: false
            }).then(resp => {
                expect(resp.status).to.eq(400)
            })
        })
    })

    it('should get 401 without token', () => {
        // when + then
        cy.api({
            method: 'POST',
            url: `${BACKEND_URL}/api/cart/items`,
            body: {
                productId: 1,
                quantity: 1
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
                method: 'POST',
                url: `${BACKEND_URL}/api/cart/items`,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    productId: nonExistentProductId,
                    quantity: 1
                },
                failOnStatusCode: false
            }).then(resp => {
                expect(resp.status).to.eq(404)
            })
        })
    })
}) 