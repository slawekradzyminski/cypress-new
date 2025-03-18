/// <reference types="cypress" />

import { getRandomUser } from "../../../generators/userGenerator"
import { cartMocks } from "../../../mocks/cartMocks"
import { loginMocks } from "../../../mocks/loginMocks"
import { meMocks } from "../../../mocks/meMocks"
import { toast } from "../../../pages/components/toast"
import { loginPage } from "../../../pages/loginPage"

describe('Login page tests in isolation', () => {
    beforeEach(() => {
        cy.visit('')
    })

    it('should login successfully', () => {
        // given
        const user = getRandomUser()
        loginMocks.mockSuccess(user)
        cartMocks.mockCartWithNItems(user.username, 2)
        meMocks.mockSuccess(user)
        cy.get('#username').should('be.visible')
        cy.percySnapshot('LoginPage')

        // when
        loginPage.attemptLogin(user.username, user.password)

        // then
        cy.get('.mt-1').should('have.text', user.email)
        cy.percySnapshot('HomePage')
    })

    it('should fail to login', () => {
        // given
        loginMocks.mockFail()
        
        // when
        loginPage.attemptLogin('wrong', 'wrong')

        // then
        toast.verifyError('Invalid username/password')
    })
})
