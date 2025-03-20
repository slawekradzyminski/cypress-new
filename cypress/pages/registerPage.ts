import { User } from "../types/user";

export const registerPage = {

    attemptRegister: (user: User) => {
        cy.get('#username').type(user.username)
        cy.get('#email').type(user.email)
        cy.get('#password').type(user.password)
        cy.get('#firstName').type(user.firstName)
        cy.get('#lastName').type(user.lastName)
        cy.get('button').contains('Create account').click()
    }

}