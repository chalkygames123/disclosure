import Disclosure from './disclosure'

document.querySelectorAll('[data-disclosure]').forEach((el) => {
  // eslint-disable-next-line no-unused-vars
  const disclosure = new Disclosure(el, {
    hashNavigation: true,
  })
})

const summary04El = document.querySelector(
  '[data-disclosure][aria-controls="disclosure-04-details"]'
)
const eventTypes = ['open', 'opened', 'close', 'closed']
const eventTypeEl = document.getElementById('event-type')

eventTypes.forEach((type) => {
  summary04El.addEventListener(type, (e) => {
    eventTypeEl.textContent = e.type
  })
})
