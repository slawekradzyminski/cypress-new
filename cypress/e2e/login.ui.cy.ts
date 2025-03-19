/// <reference types="cypress" />

describe('Login page tests', () => {

    beforeEach(() => {
        cy.visit('http://localhost:8081')
    })

    it('should display all important login page elements', () => {
        // then
        cy.get('.mt-6').should('have.text', 'Sign in to your account')
        cy.get('a').contains('Login').should('be.visible')
        cy.get('a').contains('Register').should('be.visible')
    })

    it('should successfully login', () => {
        // when
        cy.get('#username').type('admin')
        cy.get('#password').type('admin')
        cy.get('button').contains('Sign in').click()

        // then
        cy.get('h1').should('contain.text', 'Slawomir')
        cy.get('.mt-1').should('have.text', 'awesome@testing.com')
        cy.get('button').contains('View Users').should('be.visible')
        cy.get('.border').contains('Logout').should('be.visible')
    })

    it('should fail to login', () => {
        // when
        cy.get('#username').type('wrong')
        cy.get('#password').type('wrong')
        cy.get('button').contains('Sign in').click()

        // then
        cy.get('._description_gmcqp_50').should('have.text', 'Invalid username/password')
    })

    it('should open register page', () => {
        // when
        cy.get('button').contains('Register').click()

        // then
        cy.get('.mt-6').should('have.text', 'Create your account')
        cy.url().should('contain', '/register')
    })

    it('should trigger frontend validation', () => {
        // when
        cy.get('#username').type('123')
        cy.get('button').contains('Sign in').click()

        // then
        cy.get('.text-red-600').eq(0).should('have.text', 'Username must be at least 4 characters')
        cy.get('.text-red-600').eq(1).should('have.text', 'Password is required')
        cy.get('#username').should('have.class', 'border-red-500')
        cy.get('#password').should('have.class', 'border-red-500')
    })

})