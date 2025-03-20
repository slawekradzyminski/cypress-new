/// <reference types="cypress" />

import { generateUser } from "../../generators/userGenerator"
import { toast } from "../../pages/components/toast"
import { loginPage } from "../../pages/loginPage"

describe('Login page tests', { env: { snapshotOnly: true } }, () => {

    beforeEach(() => {
        cy.visit('')
    })

    it('should display all important login page elements', () => {
        // then
        cy.get(loginPage.selectors.title).should('have.text', 'Sign in to your account')
        cy.get('a').contains('Login').should('be.visible')
        cy.get('a').contains('Register').should('be.visible')
    })

    it('should successfully login', () => {
        // given
        const user = generateUser()
        cy.register(user)

        // when
        loginPage.attemptLogin(user.username, user.password)

        // then
        cy.get('h1').should('contain.text', user.firstName)
        cy.get('.mt-1').should('have.text', user.email)
        cy.get('button').contains('View Users').should('be.visible')
        cy.get('.border').contains('Logout').should('be.visible')
    })

    it('should fail to login', () => {
        // when
        loginPage.attemptLogin('wrong', 'wrong')

        // then
        toast.verifyError('Invalid username/password')
    })

    it('should open register page', () => {
        // when
        loginPage.clickRegister()

        // then
        cy.get('.mt-6').should('have.text', 'Create your account')
        cy.url().should('contain', '/register')
    })

    it('should trigger frontend validation', () => {
        // when
        cy.get(loginPage.selectors.usernameInput).type('123')
        loginPage.clickSignIn()

        // then
        cy.get(loginPage.selectors.errorMessage).eq(0).should('have.text', 'Username must be at least 4 characters')
        cy.get(loginPage.selectors.errorMessage).eq(1).should('have.text', 'Password is required')
        cy.get(loginPage.selectors.usernameInput).should('have.class', 'border-red-500')
        cy.get(loginPage.selectors.passwordInput).should('have.class', 'border-red-500')
    })

})