/**
 * ディスクロージャーウィジェットを作成する。
 *
 * DOM API:
 *
 *   - open: この属性を持つ詳細要素は開いた状態となる
 *   - data-disclosure-close: 詳細要素内にあるこの属性を持つ要素は閉じるボタンとなる
 *
 * 期待される DOM 構造:
 *
 *   ```
 *   <button id="disclosure-summary" type="button" aria-controls="disclosure-details">概要要素</button>
 *   <div id="disclosure-details" aria-labelledby="disclosure-summary">詳細要素</div>
 *   ```
 */
export default class {
  /**
   * @param {HTMLElement} summaryEl - 概要要素
   * @param {Object} options - オプション
   * @param {string} options.transitionDuration - 詳細要素の CSS transition-duration プロパティに適用する値
   * @param {string} options.transitionTimingFunction - 詳細要素の CSS transition-timing-function プロパティに適用する値
   * @param {boolean} options.hashNavigation - 初期化時、概要要素の ID が URL フラグメントと一致する場合に詳細要素を開くかどうか
   */
  constructor(summaryEl, options) {
    this.summaryEl = summaryEl
    this.options = {
      transitionDuration: '0.5s',
      transitionTimingFunction: 'ease',
      hashNavigation: false,
      ...options,
    }

    this.init()
  }

  get isOpen() {
    return this.detailsEl.hasAttribute('open')
  }

  set isOpen(value) {
    if (value) {
      this.detailsEl.setAttribute('open', '')
    } else {
      this.detailsEl.removeAttribute('open')
    }
  }

  get noTransition() {
    return /^[+-]?0+m?s/.test(this.options.transitionDuration)
  }

  init() {
    this.summaryEl.addEventListener('click', () => {
      this.isOpen = !this.isOpen
    })

    this.detailsEl = document.getElementById(
      this.summaryEl.getAttribute('aria-controls')
    )

    if (!this.isOpen) {
      if (
        this.options.hashNavigation &&
        this.summaryEl.id === window.location.hash.substring(1)
      ) {
        this.detailsEl.setAttribute('open', '')
      } else {
        this.detailsEl.style.height = '0'
        this.detailsEl.style.overflow = 'hidden'
        this.detailsEl.style.visibility = 'hidden'
      }
    }

    if (!this.noTransition) {
      this.detailsEl.addEventListener('transitionend', (e) => this.cleanUp(e))
    }

    const mutationObserver = new MutationObserver((mutations) =>
      this.handleOpenAttributeChange(mutations)
    )

    mutationObserver.observe(this.detailsEl, {
      attributes: true,
      attributeFilter: ['open'],
    })

    this.closeEls = this.detailsEl.querySelectorAll('[data-disclosure-close]')

    this.closeEls.forEach((el) => {
      el.addEventListener('click', () => {
        this.isOpen = false
      })
    })

    this.updateAriaAttributes()
  }

  updateAriaAttributes() {
    this.summaryEl.setAttribute('aria-expanded', `${this.isOpen}`)
    this.detailsEl.setAttribute('aria-hidden', `${!this.isOpen}`)
  }

  open() {
    this.detailsEl.style.transition = `height ${this.options.transitionDuration} ${this.options.transitionTimingFunction}`

    this.detailsEl.style.height = `${this.detailsEl.scrollHeight}px`
    this.detailsEl.style.visibility = ''

    this.updateAriaAttributes()

    this.summaryEl.dispatchEvent(
      new CustomEvent('open', {
        bubbles: true,
      })
    )
  }

  close() {
    const summaryElClientRect = this.summaryEl.getBoundingClientRect()

    if (
      summaryElClientRect.top < 0 ||
      window.innerHeight < summaryElClientRect.bottom
    ) {
      this.summaryEl.scrollIntoView()
    }

    this.detailsEl.style.height = `${this.detailsEl.scrollHeight}px`
    // レイアウトを強制する (参考: https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
    this.detailsEl.getBoundingClientRect()
    this.detailsEl.style.height = '0'
    this.detailsEl.style.overflow = 'hidden'

    this.detailsEl.style.transition = `height ${this.options.transitionDuration} ${this.options.transitionTimingFunction}`

    this.updateAriaAttributes()

    this.summaryEl.dispatchEvent(
      new CustomEvent('close', {
        bubbles: true,
      })
    )
  }

  cleanUp() {
    this.detailsEl.style.transition = ''

    if (this.isOpen) {
      this.detailsEl.style.height = ''
      this.detailsEl.style.overflow = ''

      this.summaryEl.dispatchEvent(
        new CustomEvent('opened', {
          bubbles: true,
        })
      )
    } else {
      this.detailsEl.style.visibility = 'hidden'

      this.summaryEl.dispatchEvent(
        new CustomEvent('closed', {
          bubbles: true,
        })
      )
    }
  }

  handleOpenAttributeChange(mutations) {
    mutations.forEach(() => {
      if (this.isOpen) {
        this.open()
      } else {
        this.close()
      }
    })

    if (this.noTransition) {
      this.cleanUp()
    }
  }
}
