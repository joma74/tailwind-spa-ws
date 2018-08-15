# tailwind-spa-ws

A `tailwind-css` enabled html/css-based single page application(spa) workspace(ws) with hot reload. Powered by `webpack`, `vue` and `vue-template-loader`.

It is targeted for online presentations/pocs/playgrounds which revolve around mostly a single html and a single css.

:sunglasses: Speeds up your fun building a webpage :sunglasses:

![tailwind-spa-ws-screenshot](https://user-images.githubusercontent.com/5314859/44167895-b62ee080-a0cf-11e8-97b0-3daba6722555.png)

## Showing you around

One of your primary files you will be working with is the file `app.html`. It starts and ends with the `<body>` element. This `<body>` is then included within `src/template.html`, where the rest of the `<html>` page is defined.

_P.S. I know, `vue` is strictly against mounting on the `<body>` element, but_ `¯\_(ツ)_/¯`

To see it in action, after installing run `yarn watch` on your workstation, then open a browser pointing at <link>http://localhost:8080/dist/index.html</link>. This will show you the screen from above.

The assets, like images and svgs you see there, are expected to be under `src/assets`. The expected location and handling of your assets are configureable via `webpack.config.js`.

Also note the applied CSS classes from `tailwind-css` in `app.html`.

## How do i save my work for e.g. distribution

Forking this project and commiting your changes there is certainly the right option, but there is another option I am using: Run `Saves as` from your browser and put it e.g. to `dist`. This should save all the html, including all css as head's style and other assets.

_P.S. Image assets get downloaded, but the svgs are not. Dunno. Ask your browser vendor._

## Some details

There are two entry points configured in webpack.

The first one is `src/js/index.js`. That will be what your spa will primarly be showing. Essentially it makes a `vue` app (see also `src/js/components/App.js`) with special support from `vue-template-loader`. `vue-template-loader` is what JS-ifies your `app.html` file and assets within that and renders them in your browser.

The second one is `src/js/dummy.js`, which is just a dummy for forcing webpack to make a `build/styles.css` file, which is configured by a once-generated `tailwind.js`, and outputs what is configured in your `app.css`. The same CSS content is applied inline as javascript via webpack as a 311.819 column wide module text source. What is somewhat hard to find and digest in your browsers dev tool, but performant for hot-reloaded changes :smirk: Hence the second entry point.

## Anything further

Said will not hinder you to sprinkle some additional `vue` powered components, rendering further html, inside your app.
Like this `vue` component...

```js
// src/js/components/OptionLine.js

// @ts-ignore
import renderFnkt from "@html/option-line.html"
import Vue from "vue"

let vueComponentOptions = Vue.extend({
  name: "OptionLine",
  props: {
    name: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
})

export default renderFnkt(vueComponentOptions)
```

...rendering this html...

```html
// src/html/option-line.html
<div class="flex -mb-px">
    <button type="button" href="#" v-bind:class="[{'text-blue-dark': isActive, 'border-blue-dark': isActive, 'hover:border-grey-dark': !isActive}]"
        class="appearance-none no-underline py-4 border-b text-grey-dark border-transparent">
        <span v-html="name"></span>
    </button>
</div>
```

...applied to your...

```html
// app.html
...
	<div id="x-rates-timelines-options" class="flex mr-2-ex-last">
	<optionline name="1H"></optionline>
	<optionline name="1D"></optionline>
	<optionline name="1W"></optionline>
	<optionline name="1M" :isActive="true"></optionline>
	<optionline name="1Y"></optionline>
	<optionline name="ALL"></optionline>
</div>
...
```

## Install instructions

```
yarn install
```

## License

MIT
