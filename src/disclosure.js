/**
 * ディスクロージャーウィジェットを作成する。
 *
 * DOM API:
 *
 *   - aria-hidden 属性の値が true でない詳細要素は開かれた状態となる
 *   - data-disclosure-close: 詳細要素内にあるこの属性を持つ要素は閉じるボタンとなる
 *
 * 期待される DOM 構造:
 *
 *   ```
 *   <button id="disclosure-summary" type="button" aria-controls="disclosure-details">概要要素</button>
 *   <div id="disclosure-details" aria-labelledby="disclosure-summary">詳細要素</div>
 *   ```
 *
 * 推奨される最小のスタイル:
 *
 *   ```
 *   .details {
 *     overflow: hidden;
 *   }
 *
 *   .details[aria-hidden='true'] {
 *     height: 0;
 *     visibility: hidden;
 *   }
 *   ```
 */
export default class {
  /**
   * @param {HTMLElement} summaryEl - 概要要素
   * @param {Object} options - オプション
   * @param {boolean} options.hashNavigation - 初期化時、URL フラグメントに一致する ID を持つ概要要素に対応する詳細要素を開くかどうか
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
      !this.isOpen &&
      this.options.hashNavigation &&
      this.summaryEl.id === window.location.hash.substring(1)
    ) {
      this.detailsEl.style.transition = 'none'
      this.open()
      this.detailsEl.style.transition = ''
    }
  }

  open() {
    this.detailsEl.style.height = `${this.detailsEl.scrollHeight}px`

    this.detailsEl.removeAttribute('aria-hidden')
    this.summaryEl.setAttribute('aria-expanded', 'true')

    this.isOpen = true

    this.emit('open')

    if (this.noTransition) {
      this.handleTransitionEnd()
    } else {
      this.detailsEl.addEventListener('transitionend', this.handleTransitionEnd)
    }
  }

  close() {
    this.detailsEl.style.height = `${this.detailsEl.scrollHeight}px`
    // eslint-disable-next-line no-unused-expressions
    this.detailsEl.clientHeight // レイアウトを強制する (参考: https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
    this.detailsEl.style.height = '0'

    this.detailsEl.setAttribute('aria-hidden', 'true')
    this.summaryEl.setAttribute('aria-expanded', 'false')

    this.scrollIntoViewIfNeeded()

    this.isOpen = false

    this.emit('close')

    if (this.noTransition) {
      this.handleTransitionEnd()
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

    /**
     * IE11 をサポートするには、代わりに:
     */
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

  handleTransitionEnd() {
    this.detailsEl.removeEventListener(
      'transitionend',
      this.handleTransitionEnd
    )

    this.detailsEl.style.height = ''

    if (this.isOpen) {
      this.emit('opened')
    } else {
      this.emit('closed')
    }
  }
}
