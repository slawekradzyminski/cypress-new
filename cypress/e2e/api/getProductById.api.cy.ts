/// <reference types="cypress" />

import { getRandomProduct } from "../../generators/productGenerator"
import { getRandomUser } from "../../generators/userGenerator"
import { Roles } from "../../types/roles"
import { BACKEND_URL } from "../../utils/constants"

describe('GET Product by ID API tests', { env: { snapshotOnly: false } }, () => {
    
    let createdProductId: number

    it('should successfully retrieve product by ID (200)', () => {
        // given
        const adminUser = getRandomUser([Roles.ROLE_ADMIN])
        const clientUser = getRandomUser([Roles.ROLE_CLIENT])
        const product = getRandomProduct()
        
        // Create product as admin first
        cy.register(adminUser)
        cy.login(adminUser.username, adminUser.password)
        
        // Create product and store its ID
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
                createdProductId = createResp.body.id
                
                // Test retrieval as admin
                cy.api({
                    method: 'GET',
                    url: `${BACKEND_URL}/api/products/${createdProductId}`,
                    headers: {
                        Authorization: `Bearer ${adminToken}`
                    }
                }).then(resp => {
                    expect(resp.status).to.eq(200)
                    expect(resp.body.id).to.eq(createdProductId)
                    expect(resp.body.name).to.eq(product.name)
                    expect(resp.body.price).to.eq(product.price)
                })
                
                // Now test retrieval as client
                cy.register(clientUser)
                cy.login(clientUser.username, clientUser.password)
                cy.get('@token').then(clientToken => {
                    cy.api({
                        method: 'GET',
                        url: `${BACKEND_URL}/api/products/${createdProductId}`,
                        headers: {
                            Authorization: `Bearer ${clientToken}`
                        }
                    }).then(clientResp => {
                        expect(clientResp.status).to.eq(200)
                        expect(clientResp.body.id).to.eq(createdProductId)
                    })
                })
            })
        })
    })

    it('should receive 401 when retrieving product without token', () => {
        // Test this only if we have a product ID from previous test
        if (createdProductId) {
            // when + then
            cy.api({
                method: 'GET',
                url: `${BACKEND_URL}/api/products/${createdProductId}`,
                failOnStatusCode: false
            }).then(resp => {
                expect(resp.status).to.eq(401)
            })
        } else {
            // Create a product first if needed
            const adminUser = getRandomUser([Roles.ROLE_ADMIN])
            const product = getRandomProduct()
            
            cy.register(adminUser)
            cy.login(adminUser.username, adminUser.password)
            
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
                    
                    // Test unauthorized access
                    cy.api({
                        method: 'GET',
                        url: `${BACKEND_URL}/api/products/${productId}`,
                        failOnStatusCode: false
                    }).then(resp => {
                        expect(resp.status).to.eq(401)
                    })
                })
            })
        }
    })

    it('should receive 404 when product ID does not exist', () => {
        // given
        const user = getRandomUser()
        cy.register(user)
        cy.login(user.username, user.password)
        
        // Use a very large ID that is unlikely to exist
        const nonExistentProductId = 999999999
        
        // when + then
        cy.get('@token').then(token => {
            cy.api({
                method: 'GET',
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