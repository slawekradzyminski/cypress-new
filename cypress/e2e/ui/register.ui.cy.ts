/// <reference types="cypress" />

import { generateUser } from "../../generators/userGenerator"
import { registerPage } from "../../pages/registerPage"

describe('Register page tests', { env: { snapshotOnly: true } }, () => {

    beforeEach(() => {
        cy.visit('http://localhost:8081/register')
    })
 
    it('should successfully register new user', () => {
        // given
        const user = generateUser()

        // when
        registerPage.attemptRegister(user)

        // then
        cy.get('._description_gmcqp_50').should('contain.text', 'Registration successful')
        cy.url().should('contain', '/login')
    })

    it('should fail to register if user already exists', () => {
        // given
        const user = generateUser()
        cy.register(user)

        // when
        registerPage.attemptRegister(user)

        // then
        cy.get('._description_gmcqp_50').should('have.text', 'Username already exists')
    })
 
 })
 