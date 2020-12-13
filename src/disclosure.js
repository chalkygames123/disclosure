/**
 * ディスクロージャーウィジェットを作成する。
 *
 * - aria-hidden 属性の値が true でない詳細要素は開かれた状態となる。
 * - 詳細要素内にある data-disclosure-close 属性を持つ要素は閉じるボタンとなる。
 *
 * 期待される DOM 構造:
 *
 * ```html
 * <button type="button" aria-controls="disclosure-details">概要要素</button>
 * <div id="disclosure-details" aria-hidden="true">詳細要素</div>
 * ```
 *
 * 推奨される最小のスタイル:
 *
 * ```css
 * .details {
 *   overflow: hidden;
 *   contain: content;
 * }
 *
 * .details[aria-hidden='true'] {
 *   height: 0;
 *   visibility: hidden;
 * }
 * ```
 */
export default class {
  /**
   * @param {HTMLElement} - summaryEl 概要要素
   * @param {Object} - options オプション
   * @param {boolean} - options.hashNavigation 初期化時、URL フラグメントに一致する ID を持つ概要要素に対応する詳細要素を開くかどうか
   */
  constructor(summaryEl, options) {
    this.summaryEl = summaryEl
    this.options = {
      hashNavigation: false,
      ...options,
    }

    this.init()
  }

  get noTransition() {
    const detailsElComputedStyle = getComputedStyle(this.detailsEl)

    return (
      detailsElComputedStyle.transitionDuration === '0s' &&
      detailsElComputedStyle.transitionDelay === '0s'
    )
  }

  init() {
    this.handleSummaryElClick = this.handleSummaryElClick.bind(this)
    this.summaryEl.addEventListener('click', this.handleSummaryElClick)

    this.detailsEl = document.getElementById(
      this.summaryEl.getAttribute('aria-controls')
    )

    this.closeEls = this.detailsEl.querySelectorAll('[data-disclosure-close]')
    this.handleCloseElClick = this.handleCloseElClick.bind(this)
    this.closeEls.forEach((el) => {
      el.addEventListener('click', this.handleCloseElClick)
    })

    this.handleTransitionEnd = this.handleTransitionEnd.bind(this)

    this.isOpen = this.detailsEl.getAttribute('aria-hidden') !== 'true'

    if (
      this.isOpen ||
      (this.options.hashNavigation &&
        this.summaryEl.id &&
        this.summaryEl.id === window.location.hash.substring(1))
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

  open() {
    this.detailsEl.style.height = `${this.detailsEl.scrollHeight}px`

    this.detailsEl.removeAttribute('aria-hidden')
    this.summaryEl.setAttribute('aria-expanded', 'true')

    this.isOpen = true

    this.emit('open')

    if (this.noTransition) {
      this.cleanUp()
    } else {
      this.detailsEl.addEventListener('transitionend', this.handleTransitionEnd)
    }
  }

  close() {
    if (!this.noTransition) {
      this.detailsEl.style.height = `${this.detailsEl.scrollHeight}px`
      // eslint-disable-next-line no-unused-expressions
      this.detailsEl.clientHeight // レイアウトを強制する (参考: https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
    }

    this.detailsEl.style.height = '0'

    this.detailsEl.setAttribute('aria-hidden', 'true')
    this.summaryEl.setAttribute('aria-expanded', 'false')

    this.scrollIntoViewIfNeeded()

    this.isOpen = false

    this.emit('close')

    if (this.noTransition) {
      this.cleanUp()
    } else {
      this.detailsEl.addEventListener('transitionend', this.handleTransitionEnd)
    }
  }

  scrollIntoViewIfNeeded() {
    const summaryElClientRect = this.summaryEl.getBoundingClientRect()

    if (
      summaryElClientRect.top < 0 ||
      window.innerHeight < summaryElClientRect.bottom
    ) {
      this.summaryEl.scrollIntoView()
    }

    // IE11 をサポートするには、代わりに:
    // if (summaryElClientRect.top < 0) {
    //   window.scrollBy(0, summaryElClientRect.top)
    // } else if (window.innerHeight < summaryElClientRect.bottom) {
    //   window.scrollBy(0, summaryElClientRect.bottom - window.innerHeight)
    // }
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
      this.emit('opened')
    } else {
      this.emit('closed')
    }
  }

  emit(type) {
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
  }

  handleTransitionEnd(e) {
    if (e && e.target !== this.detailsEl) return

    this.cleanUp()
  }
}
