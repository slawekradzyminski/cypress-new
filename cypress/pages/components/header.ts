export const header = {

    logoutOnMobile: () => {
        cy.get('.lucide-menu').click()
        cy.get('[data-testid=mobile-menu]').find('button').contains('Logout').click()
    },

    clickMenuItem: (item: string) => {
        cy.get('nav').find('a').contains(item).click()
    }

}