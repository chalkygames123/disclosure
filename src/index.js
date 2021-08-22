import { Disclosure } from './modules'

const disclosures = []

for (const el of document.querySelectorAll('.js-disclosure')) {
	const disclosure = new Disclosure(el, {
		hashNavigation: true,
	})

	disclosures.push(disclosure)
}

document.querySelector('#open-all').addEventListener('click', () => {
	for (const el of disclosures) {
		el.open()
	}
})

document.querySelector('#close-all').addEventListener('click', () => {
	for (const el of disclosures) {
		el.close()
	}
})

const summary04El = document.querySelector(
	'.js-disclosure[aria-controls="disclosure-custom-event-details"]'
)
const eventTypes = ['open', 'opened', 'close', 'closed']
const eventTypeEl = document.querySelector('#event-type')

for (const type of eventTypes) {
	summary04El.addEventListener(type, (e) => {
		eventTypeEl.textContent = e.type
	})
}
