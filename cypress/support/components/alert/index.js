import { el } from './elements'

class Alert {
	shouldHaveText(expectedText) {
		cy.contains(el.alert, expectedText)
			.should('be.visible')
	}
}

export default new Alert()