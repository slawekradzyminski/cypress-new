/// <reference types="cypress" />

import { getRandomProduct } from "../../generators/productGenerator"
import { getRandomUser } from "../../generators/userGenerator"
import { Roles } from "../../types/roles"
import { BACKEND_URL } from "../../utils/constants"

describe('DELETE Product API tests', { env: { snapshotOnly: false } }, () => {
    
    it('should successfully delete product as admin (204)', () => {
        // given
        const user = getRandomUser([Roles.ROLE_ADMIN])
        cy.register(user)
        cy.login(user.username, user.password)
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
                
                // when
                cy.api({
                    method: 'DELETE',
                    url: `${BACKEND_URL}/api/products/${productId}`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(deleteResp => {
                    // then
                    expect(deleteResp.status).to.eq(204)
                    
                    // Verify product is deleted by trying to get it
                    cy.api({
                        method: 'GET',
                        url: `${BACKEND_URL}/api/products/${productId}`,
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        failOnStatusCode: false
                    }).then(getResp => {
                        expect(getResp.status).to.eq(404)
                    })
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
                
                // when + then
                cy.api({
                    method: 'DELETE',
                    url: `${BACKEND_URL}/api/products/${productId}`,
                    failOnStatusCode: false
                }).then(deleteResp => {
                    expect(deleteResp.status).to.eq(401)
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
                
                // Delete as client
                const clientUser = getRandomUser([Roles.ROLE_CLIENT])
                cy.register(clientUser)
                cy.login(clientUser.username, clientUser.password)
                
                // when + then
                cy.get('@token').then(clientToken => {
                    cy.api({
                        method: 'DELETE',
                        url: `${BACKEND_URL}/api/products/${productId}`,
                        headers: {
                            Authorization: `Bearer ${clientToken}`
                        },
                        failOnStatusCode: false
                    }).then(deleteResp => {
                        expect(deleteResp.status).to.eq(403)
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
        
        // Use a non-existent product ID
        const nonExistentProductId = 999999999
        
        // when + then
        cy.get('@token').then(token => {
            cy.api({
                method: 'DELETE',
                url: `${BACKEND_URL}/api/products/${nonExistentProductId}`,
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