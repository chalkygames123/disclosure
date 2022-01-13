# disclosure

[![code style: XO](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4?logo=prettier&logoColor=fff)](https://github.com/prettier/prettier)
[![Netlify Status](https://api.netlify.com/api/v1/badges/2fea87b8-fcd5-4caf-9961-5da1224efb46/deploy-status)](https://app.netlify.com/sites/disclosure-chalkygames123/deploys)
[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/chalkygames123/disclosure)

> Accessible, dependency-free disclosure implementation

## Demo

https://disclosure-chalkygames123.netlify.app/

## Installation

Copy [src/modules/disclosure.js](src/modules/disclosure.js) to your project.

## Usage

### Markup

Here is the basic markup, which can be enhanced. Pay extra attention to the comments.

```html
<!-- 1. The summary element -->
<button type="button" aria-controls="details">Summary</button>
<!-- 2. The details element -->
<div id="details" aria-hidden="true">Details</div>
```

1. The summary element.

   - It has to have the `aria-controls` attribute, which matches the `id` of the details element.

2. The details element.

   - It has to have the `id` attribute.
   - It should have an initial `aria-hidden="true"` attribute to avoid a "flash of unhidden content" on page load.

### Styling

The script itself does not take care of any styling whatsoever, not even the `display` property. Instead, it toggles the `aria-expanded` attribute on the summary element and the `aria-hidden` attribute on the details element.

Here is a solid set of styles to get started (note that you might have to rename the class names to fit your code):

```css
.details {
	overflow: hidden;
	transition: height 0.5s;
	contain: content;
}

.details[aria-hidden='true'] {
	height: 0;
	visibility: hidden;
	transition: height 0.5s, visibility 0s 0.5s;
}
```

The rest, such as what the disclosure really looks like, and how its content is styled, is left at your discretion. These styles should be enough to get you on the right track. Feel free to look at [the demo](https://disclosure-chalkygames123.netlify.app/) for more extensive styles.

### Instantiation

Pass the summary element to the constructor.

```js
// Get the summary element (with the accessor method you want)
const summaryElement = document.querySelector('#your-summary-id');

// Instantiate a new Disclosure module
const disclosure = new Disclosure(summaryElement);
```

#### Options

The constructor takes an options object as a second argument. Currently, only one option is available:

| Name           | Type    | Default | Description                                                                                                                |
| -------------- | ------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| hashNavigation | boolean | false   | Whether the disclosure is automatically opened if the ID of the summary element matches the URL fragment on initialization |

### Interactions

#### DOM API

The DOM API relies on `data-*` attributes. They all live under the `data-disclosure-*` namespace for consistency, clarity, and robustness. Currently, only one attribute is recognized:

- `data-disclosure-close`: the closest parent disclosure will be the target

The following button will close the disclosure in which it lives when interacted with.

```html
<button type="button" data-disclosure-close>Close</button>
```

#### JS API

Regarding the JS API, it simply consists on `open()`, `close()` and `toggle()` methods on the disclosure instance.

```js
// Open the disclosure
disclosure.open();

// Close the disclosure
disclosure.close();

// Toggle the disclosure
disclosure.toggle();
```

### Advanced

#### Events

When interaction, the summary element will emit certain events. It is possible to subscribe to these with the `addEventListener()` method.

```js
disclosure.addEventListener('open', function (event) {
	// Do something when disclosure gets open
});

disclosure.addEventListener('opened', function (event) {
	// Do something when disclosure gets opened
});

disclosure.addEventListener('close', function (event) {
	// Do something when disclosure gets close
});

disclosure.addEventListener('closed', function (event) {
	// Do something when disclosure gets closed
});
```
