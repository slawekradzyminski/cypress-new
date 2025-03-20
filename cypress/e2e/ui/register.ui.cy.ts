/// <reference types="cypress" />

import { generateUser } from "../../generators/userGenerator"
import { toast } from "../../pages/components/toast"
import { registerPage } from "../../pages/registerPage"

describe('Register page tests', { env: { snapshotOnly: true } }, () => {

    beforeEach(() => {
        cy.visit('/register')
    })
 
    it('should successfully register new user', () => {
        // given
        const user = generateUser()

        // when
        registerPage.attemptRegister(user)

        // then
        toast.verifySuccess('Registration successful')
        cy.url().should('contain', '/login')
    })

    it('should fail to register if user already exists', () => {
        // given
        const user = generateUser()
        cy.register(user)

        // when
        registerPage.attemptRegister(user)

        // then
        toast.verifyError('Username already exists')
    })
 
 })
 