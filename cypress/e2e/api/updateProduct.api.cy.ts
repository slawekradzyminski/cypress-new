/// <reference types="cypress" />

import { getRandomProduct } from "../../generators/productGenerator"
import { getRandomUser } from "../../generators/userGenerator"
import { Roles } from "../../types/roles"
import { BACKEND_URL } from "../../utils/constants"

describe('PUT Product API tests', { env: { snapshotOnly: false } }, () => {
    
    it('should successfully update product as admin (200)', () => {
        // given
        const user = getRandomUser([Roles.ROLE_ADMIN])
        cy.register(user)
        cy.login(user.username, user.password)
        const originalProduct = getRandomProduct()
        
        // Create a product first
        cy.get('@token').then(token => {
            cy.api({
                method: 'POST',
                url: `${BACKEND_URL}/api/products`,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: originalProduct
            }).then(createResp => {
                expect(createResp.status).to.eq(201)
                const productId = createResp.body.id
                
                // Create updated product with new values
                const updatedProduct = {
                    ...originalProduct,
                    name: originalProduct.name + ' (Updated)',
                    price: originalProduct.price + 10,
                    stockQuantity: originalProduct.stockQuantity + 5
                }
                
                // when
                cy.api({
                    method: 'PUT',
                    url: `${BACKEND_URL}/api/products/${productId}`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: updatedProduct
                }).then(updateResp => {
                    // then
                    expect(updateResp.status).to.eq(200)
                    expect(updateResp.body.name).to.eq(updatedProduct.name)
                    expect(updateResp.body.price).to.eq(updatedProduct.price)
                    expect(updateResp.body.stockQuantity).to.eq(updatedProduct.stockQuantity)
                })
            })
        })
    })

    it('should receive 400 if invalid stockQuantity', () => {
        // given
        const user = getRandomUser([Roles.ROLE_ADMIN])
        cy.register(user)
        cy.login(user.username, user.password)
        const originalProduct = getRandomProduct()
        
        // Create a product first
        cy.get('@token').then(token => {
            cy.api({
                method: 'POST',
                url: `${BACKEND_URL}/api/products`,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: originalProduct
            }).then(createResp => {
                expect(createResp.status).to.eq(201)
                const productId = createResp.body.id
                
                // Create updated product with invalid values
                const invalidProduct = {
                    ...originalProduct,
                    stockQuantity: -5
                }
                
                // when
                cy.api({
                    method: 'PUT',
                    url: `${BACKEND_URL}/api/products/${productId}`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: invalidProduct,
                    failOnStatusCode: false
                }).then(updateResp => {
                    // then
                    expect(updateResp.status).to.eq(400)
                    expect(updateResp.body.stockQuantity).to.eq('Stock quantity cannot be negative')
                })
            })
        })
    })

    it('should receive 401 without token', () => {
        // given
        const adminUser = getRandomUser([Roles.ROLE_ADMIN])
        cy.register(adminUser)
        cy.login(adminUser.username, adminUser.password)
        const product = getRandomProduct()
        
        // Create a product first
        cy.get('@token').then(token => {
            cy.api({
                method: 'POST',
                url: `${BACKEND_URL}/api/products`,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: product
            }).then(createResp => {
                expect(createResp.status).to.eq(201)
                const productId = createResp.body.id
                
                // Update without token
                const updatedProduct = {
                    ...product,
                    name: product.name + ' (Updated)'
                }
                
                // when + then
                cy.api({
                    method: 'PUT',
                    url: `${BACKEND_URL}/api/products/${productId}`,
                    body: updatedProduct,
                    failOnStatusCode: false
                }).then(updateResp => {
                    expect(updateResp.status).to.eq(401)
                })
            })
        })
    })

    it('should receive 403 as client', () => {
        // given
        // Create product as admin first
        const adminUser = getRandomUser([Roles.ROLE_ADMIN])
        cy.register(adminUser)
        cy.login(adminUser.username, adminUser.password)
        const product = getRandomProduct()
        
        cy.get('@token').then(adminToken => {
            cy.api({
                method: 'POST',
                url: `${BACKEND_URL}/api/products`,
                headers: {
                    Authorization: `Bearer ${adminToken}`
                },
                body: product
            }).then(createResp => {
                expect(createResp.status).to.eq(201)
                const productId = createResp.body.id
                
                // Update as client
                const clientUser = getRandomUser([Roles.ROLE_CLIENT])
                cy.register(clientUser)
                cy.login(clientUser.username, clientUser.password)
                
                const updatedProduct = {
                    ...product,
                    name: product.name + ' (Updated)'
                }
                
                // when + then
                cy.get('@token').then(clientToken => {
                    cy.api({
                        method: 'PUT',
                        url: `${BACKEND_URL}/api/products/${productId}`,
                        headers: {
                            Authorization: `Bearer ${clientToken}`
                        },
                        body: updatedProduct,
                        failOnStatusCode: false
                    }).then(updateResp => {
                        expect(updateResp.status).to.eq(403)
                    })
                })
            })
        })
    })

    it('should receive 404 when product ID does not exist', () => {
        // given
        const user = getRandomUser([Roles.ROLE_ADMIN])
        cy.register(user)
        cy.login(user.username, user.password)
        const product = getRandomProduct()
        
        // Use a non-existent product ID
        const nonExistentProductId = 999999999
        
        // when + then
        cy.get('@token').then(token => {
            cy.api({
                method: 'PUT',
                url: `${BACKEND_URL}/api/products/${nonExistentProductId}`,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: product,
                failOnStatusCode: false
            }).then(resp => {
                expect(resp.status).to.eq(404)
            })
        })
    })
}) 