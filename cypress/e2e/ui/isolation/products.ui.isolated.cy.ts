/// <reference types="cypress" />

import products from '../../../fixtures/products.json'
import { getRandomUser } from '../../../generators/userGenerator'
import { cartMocks } from '../../../mocks/cartMocks'
import { meMocks } from '../../../mocks/meMocks'
import { productMocks } from '../../../mocks/productsMocks'

describe('Products page isolated tests', () => {
    beforeEach(() => {
      const user = getRandomUser()
      localStorage.setItem('token', 'fakeCypressTestsToken')
      meMocks.mockSuccess(user)
      cartMocks.mockCartWithNItems(user.username, 2)
      productMocks.mockSuccess()  
      cy.visit('/products')
    })
  
    it('should display all products', () => {
        // then
        cy.get('[data-testid=product-item]').should('have.length', products.length)
        cy.get('[data-testid=product-item] h3').each(($el, i) => {
            const names = products.map(it => it.name)
            expect(names).to.contain($el.text())
        })
    })
  })
  