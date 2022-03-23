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
#### `brackets-pair`

Matches the content of bracket pairs

```js
v
(          )
 ^        ^
```

#### `dash`

Match identifier with dashes

#### `html-element-pair`

Matches open and close tag name of a HTML element.

#### `js-assign`

Matches JavaScript assignment.

```js
        v
const a = []
^          ^
```

#### `js-blocks`

Matches JavaScript blocks like `if`, `for`, `while`, etc.

```js
v
function () {     }
^                 ^
```
<!--rules-->

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
