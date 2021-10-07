import { Disclosure } from './modules';

const summaryElement = document.querySelector('#disclosure-summary');

const eventTypeElement = document.querySelector('#event-type');

for (const eventType of ['open', 'opened', 'close', 'closed']) {
	summaryElement.addEventListener(eventType, (e) => {
		eventTypeElement.textContent = e.type;
	});
}

// eslint-disable-next-line no-unused-vars
const disclosure = new Disclosure(summaryElement, {
	hashNavigation: true,
});
