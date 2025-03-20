export const loginPage = {

    attemptLogin: (username: string, password: string) => {
        cy.get('#username').type(username)
        cy.get('#password').type(password)
        loginPage.clickSignIn()
    },

    clickSignIn: () => {
        cy.get('button').contains('Sign in').click()
    },

    clickRegister: () => {
        cy.get('button').contains('Register').click()
    }

}