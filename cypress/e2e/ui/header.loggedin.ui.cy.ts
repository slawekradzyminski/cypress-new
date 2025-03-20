/// <reference types="cypress" />

import { generateUser } from "../../generators/userGenerator"
import { header } from "../../pages/components/header"
import { User } from "../../types/user"

describe('Header UI logged in tests', { env: { snapshotOnly: true } }, () => {
    let user: User

    beforeEach(() => {
        user = generateUser()
        cy.register(user)
        cy.login(user.username, user.password)
        cy.get('@token').then(token => {
            localStorage.setItem('token', `${token}`)
        })
        cy.visit('')
    })

    afterEach(() => {
        cy.get('@token').then(token => {
            cy.deleteUser(user.username, `${token}`)
        })
    })

    it('should successfully logout on mobile view', () => {
        // given
        cy.viewport(393, 852) // iPhone 16 viewport

        // when
        header.logoutOnMobile()

        // then
        cy.url().should('contain', '/login')
    })

    it('should open qr code generation page', () => {
        // when
        header.clickMenuItem('QR Code')

        // then
        cy.url().should('contain', '/qr')
    })

 })
 