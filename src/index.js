import Disclosure from './disclosure'

Array.prototype.forEach.call(
  document.querySelectorAll('[data-disclosure]'),
  el => {
    // eslint-disable-next-line no-unused-vars
    const disclosure = new Disclosure(el, {
      hashNavigation: true
    })
  }
)

const summaryEl = document.getElementById('disclosure-04-summary')
const eventTypes = ['open', 'opened', 'close', 'closed']
const eventTypeEl = document.getElementById('event-type')

eventTypes.forEach(type => {
  summaryEl.addEventListener(type, e => {
    eventTypeEl.textContent = e.type
  })
})
