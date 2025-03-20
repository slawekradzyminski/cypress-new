/// <reference types="cypress" />

import { generateUser } from "../../generators/userGenerator"

describe('Products page tests', () => {
  
    beforeEach(() => {
        const user = generateUser()
        cy.register(user)
        cy.login(user.username, user.password)
        cy.get('@token').then(token => {
            localStorage.setItem('token', `${token}`)
        })
        cy.visit('http://localhost:8081/products')
    })

    it('should display products and categories', () => {
        cy.get('[data-testid=product-item]').should('have.length.at.least', 5)
        cy.get('[data-testid=product-filter-category] li').should('have.length.at.least', 5)
    })
 })
 