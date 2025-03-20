export const loginPage = {

    selectors: {
        usernameInput: '#username',
        passwordInput: '#password',
        errorMessage: '.text-red-600',
        title: '.mt-6'
    },

    attemptLogin: (username: string, password: string) => {
        cy.get(loginPage.selectors.usernameInput).type(username)
        cy.get(loginPage.selectors.passwordInput).type(password)
        loginPage.clickSignIn()
    },

    clickSignIn: () => {
        cy.get('button').contains('Sign in').click()
    },

    clickRegister: () => {
        cy.get('button').contains('Register').click()
    }

}