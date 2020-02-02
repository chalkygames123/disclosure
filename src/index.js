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

document
  .getElementById('disclosure-05-container')
  .addEventListener('open', e => {
    e.currentTarget.classList.add('is-open')
  })

document
  .getElementById('disclosure-05-container')
  .addEventListener('close', e => {
    e.currentTarget.classList.remove('is-open')
  })
