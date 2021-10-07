export default class {
	summaryEl = undefined
	options = {}

	detailsEl = undefined
	closers = []
	isOpen = false

	handleSummaryElClick = this.handleSummaryElClick.bind(this)
	handleCloseElClick = this.handleCloseElClick.bind(this)
	handleTransitionEnd = this.handleTransitionEnd.bind(this)

	get noTransition() {
		const detailsElComputedStyle = getComputedStyle(this.detailsEl)

		return (
			detailsElComputedStyle.transitionDuration === '0s' &&
			detailsElComputedStyle.transitionDelay === '0s'
		)
	}

	/**
	 * @param {HTMLElement} summaryEl - The summary element
	 * @param {Object} options - Options
	 * @param {boolean} options.hashNavigation - Whether the disclosure is automatically opened if the ID of the summary element matches the URL fragment on initialization
	 */
	constructor(summaryEl, options) {
		this.summaryEl = summaryEl
		this.options = {
			hashNavigation: false,
			...options,
		}

		this.init()
	}

	init() {
		this.summaryEl.addEventListener('click', this.handleSummaryElClick)

		this.detailsEl = document.querySelector(
			`#${this.summaryEl.getAttribute('aria-controls')}`
		)

		this.closers = this.detailsEl.querySelectorAll('[data-disclosure-close]')

		for (const el of this.closers) {
			el.addEventListener('click', this.handleCloseElClick)
		}

		if (
			this.options.hashNavigation &&
			this.summaryEl.id &&
			this.summaryEl.id === window.location.hash.slice(1)
		) {
			if (this.noTransition) {
				this.open()
			} else {
				this.detailsEl.style.transition = 'none'
				this.open()
				this.detailsEl.style.transition = ''
			}
		}
	}

	scrollIntoViewIfNeeded() {
		const summaryElClientRect = this.summaryEl.getBoundingClientRect()

		if (
			summaryElClientRect.top < 0 ||
			window.innerHeight < summaryElClientRect.bottom
		) {
			this.summaryEl.scrollIntoView({
				block: 'center',
			})
		}
	}

	open() {
		if (this.isOpen) return

		this.isOpen = true

		this.detailsEl.style.height = `${this.detailsEl.scrollHeight}px`

		this.detailsEl.removeAttribute('aria-hidden')
		this.summaryEl.setAttribute('aria-expanded', 'true')

		if (this.noTransition) {
			this.cleanUp()
		} else {
			this.detailsEl.addEventListener('transitionend', this.handleTransitionEnd)
		}

		this.dispatch('open')
	}

	close() {
		if (!this.isOpen) return

		this.isOpen = false

		if (!this.noTransition) {
			this.detailsEl.style.height = `${this.detailsEl.scrollHeight}px`
			// eslint-disable-next-line no-unused-expressions
			this.detailsEl.clientHeight // Force layout (See: https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
		}

		this.detailsEl.style.height = '0'

		this.detailsEl.setAttribute('aria-hidden', 'true')
		this.summaryEl.setAttribute('aria-expanded', 'false')

		if (this.noTransition) {
			this.cleanUp()
		} else {
			this.detailsEl.addEventListener('transitionend', this.handleTransitionEnd)
		}

		this.dispatch('close')
	}

	toggle() {
		if (this.isOpen) {
			this.close()
		} else {
			this.open()
		}
	}

	cleanUp() {
		if (!this.noTransition) {
			this.detailsEl.removeEventListener(
				'transitionend',
				this.handleTransitionEnd
			)
		}

		this.detailsEl.style.height = ''

		if (this.isOpen) {
			this.dispatch('opened')
		} else {
			this.dispatch('closed')
		}
	}

	dispatch(type) {
		this.summaryEl.dispatchEvent(
			new CustomEvent(type, {
				bubbles: true,
			})
		)
	}

	handleSummaryElClick() {
		this.toggle()
	}

	handleCloseElClick() {
		this.close()

		this.summaryEl.focus()

		this.scrollIntoViewIfNeeded()
	}

	handleTransitionEnd(e) {
		if (e.target !== this.detailsEl) return

		this.cleanUp()
	}
}
