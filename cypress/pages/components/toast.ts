export const toast = {

    verifySuccess: (message: string) => {
        cy.get('._title_gmcqp_44').should('have.text', 'Success')
        cy.get('._description_gmcqp_50').should('contain.text', message)
    },

    verifyError: (message: string) => {
        cy.get('._title_gmcqp_44').should('have.text', 'Error')
        cy.get('._description_gmcqp_50').should('contain.text', message)
    },

}