<p align="center">
<img src="https://raw.githubusercontent.com/antfu/vscode-smart-clicks/main/res/icon.png" height="150">
</p>

<h1 align="center">Smart Clicks <sup>VS Code</sup></h1>

<p align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=antfu.smart-clicks" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/antfu.smart-clicks.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>
</p>

<p align="center">
Smart selection with double clicks for VS Code.<br>
<a href="https://twitter.com/antfu7/status/1506508822030200833">GIF Demo</a>
</p>

## Usage

Double clicks on the code.

## Rules

<!-- Generated from JSDocs, do not modify it directly -->
<!--rules-->
#### [`bracket-pair`](https://github.com/antfu/vscode-smart-clicks/blob/main/src/rules/bracket-pair.ts)

Pair to inner content of brackets.

```js
▽
(foo, bar)
 └──────┘
```

#### [`dash`](https://github.com/antfu/vscode-smart-clicks/blob/main/src/rules/dash.ts)

`-` to identifier.

```css
   ▽
foo-bar
└─────┘
```

#### [`html-element`](https://github.com/antfu/vscode-smart-clicks/blob/main/src/rules/html-element.ts)

`<` to the entire element.

```html
▽
<div><div></div></div>
└────────────────────┘
```

#### [`html-tag-pair`](https://github.com/antfu/vscode-smart-clicks/blob/main/src/rules/html-tag-pair.ts)

Open and close tags of a HTML element.

```html
 ▽
<div><div></div></div>
 └─┘              └─┘
```

#### [`js-arrow-fn`](https://github.com/antfu/vscode-smart-clicks/blob/main/src/rules/js-arrow-fn.ts)

`=>` to arrow function.

```js
       ▽
(a, b) => a + b
└─────────────┘
```

#### [`js-assign`](https://github.com/antfu/vscode-smart-clicks/blob/main/src/rules/js-assign.ts)

`=` to assignment.

```js
        ▽
const a = []
└──────────┘
```

#### [`js-block`](https://github.com/antfu/vscode-smart-clicks/blob/main/src/rules/js-block.ts)

Blocks like `if`, `for`, `while`, etc. in JavaScript.

```js
▽
function () {     }
└─────────────────┘
```

```js
▽
import { ref } from 'vue'
└───────────────────────┘
```

#### [`jsx-tag-pair`](https://github.com/antfu/vscode-smart-clicks/blob/main/src/rules/jsx-tag-pair.ts)

Matches JSX elements' start and end tags.

```jsx
  ▽
(<Flex.Item>Hi</Flex.Item>)
  └───────┘     └───────┘
```
<!--rules-->

## Configuration

All the rules are enabled by default. To disable specific a rule, set the rule to `false` in `smartClicks.rules` of your VS Code settings:

```jsonc
// settings.json
{
  "smartClicks.rules": {
    "dash": true,
    "html-element": true
  }
}
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.png'/>
  </a>
</p>

## Credits

Inspired by [HBuilderX](https://www.dcloud.io/hbuilderx.html), initiated by [恐粉龙](https://space.bilibili.com/432190144).

## License

[MIT](./LICENSE) License © 2022 [Anthony Fu](https://github.com/antfu)
