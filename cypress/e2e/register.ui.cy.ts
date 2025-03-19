/// <reference types="cypress" />

describe('Register page tests', () => {

    beforeEach(() => {
        cy.visit('http://localhost:8081/register')
    })
 
    it('should fail to register if user already exists', () => {
        // given
        const usernameWhichExists = 'admin'

        // when
        cy.get('#username').type(usernameWhichExists)
        cy.get('#email').type('email@gmail.com')
        cy.get('#password').type('p@ssw0rd')
        cy.get('#firstName').type('Janek')
        cy.get('#lastName').type('Nowak')
        cy.get('button').contains('Create account').click()

        // then
        cy.get('._description_gmcqp_50').should('have.text', 'Username already exists')
    })
 
 })
 