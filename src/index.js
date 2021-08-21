import { Disclosure } from './modules'

const disclosures = []

for (const el of document.querySelectorAll('[data-disclosure]')) {
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
	'[data-disclosure][aria-controls="disclosure-04-details"]'
)
const eventTypes = ['open', 'opened', 'close', 'closed']
const eventTypeEl = document.querySelector('#event-type')

for (const type of eventTypes) {
	summary04El.addEventListener(type, (e) => {
		eventTypeEl.textContent = e.type
	})
}
