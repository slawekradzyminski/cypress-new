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
        // then
        cy.get('[data-testid=product-item]').first().contains('Apple Watch Series 7')
        cy.get('[data-testid=product-item]').should('have.length.at.least', 5)
        cy.get('[data-testid=product-filter-category] li').should('have.length.at.least', 5)
    })

    it('should successfully add "Clean Code" product to basket', () => {
        // when
        cy.get('[data-testid=product-item]')
            .contains('Clean Code') // Find product by name
            .parents('[data-testid=product-item]') // Get the parent product item container
            .find('button').contains('Add to Cart') // Find the "Add to Cart" button
            .click();
    
        // then
        cy.get('._description_gmcqp_50').should('contain.text', 'added to your cart');
        cy.get('[data-testid=product-item]')
            .contains('Clean Code') // Find product by name again
            .parents('[data-testid=product-item]') // Get the parent product item container
            .within(() => {
                cy.get('button').contains('Remove').should('be.visible');
                cy.get('button').contains('Update Cart').should('be.visible');
                cy.get('button').contains('Add to Cart').should('not.exist');
                cy.get('.text-blue-600').should('have.text', '1 in cart');
            });
    
        cy.get('[data-testid=desktop-cart-icon] span').should('have.text', '1');
    });

    it('should successfully find "Clean Code"', () => {
        // when
        cy.get('[data-testid=product-search]').type('Clean Code')

        // then
        cy.get('[data-testid=product-item]').should('have.length', 1).contains('Clean Code')
    })

    it('should show no products found message', () => {
        // when
        cy.get('[data-testid=product-search]').type('Invalid Query')

        // then
        cy.get('[data-testid="no-products-message"]').should('be.visible')
        cy.get('[data-testid="reset-search-button"]').should('be.visible')
    })

 })
 