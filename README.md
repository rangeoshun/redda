# redda
A functional approach to a JSONML based UI

## Description

The goal of the project is to create a UI framework that reads data and produces HTML. The basis is to use [JSONML](http://www.jsonml.org/) and augment it with the ability to use functions or symbols as `tag-name`.

### Basic example

```javascript
const div = require('redda/dom_syms')
const { to_jsonml, to_html } = require('redda/core')

const app_style = {
  display: 'flex'
}

const header_style = {
  height: '50px',
  flex_shrink: 0
}

const header = () => [div, { id: 'head', style: header_style }, 'Title']
const body = () => [div, { id: 'body' }, 'Nice app']
const app = () => [div, { id: 'app', style: app_style }, [header], [body]]

console.log(to_html(to_jsonml([app]))
```

The example above should result in the following HTML string. Note: it was beautified to allow easier parsing for humans. Yes, there might be obvious issues for now.

```html
<div id="app" style=" display: flex;">
  <div id="head" style="height: 50px; flex-shrink: 0;">Title</div>
  <div id="body">Nice app</div>
</div>
```

## Instructions

### Initial steps

#### Prerequisites

You'll need Node.js (at least v8.11 is recommended) and yarn for dependency management, and rollup installed globally.

```shell
yarn global add rollup
```

The plan is to have a docker environment for development, but you'll need dependencies installed locally for now.

#### Dependencies

After checking out the repo, execute following command in project root. This will install developement dependencies. One of the goals of this project is not to have any outter dependencies for final build.

```shell
yarn
```

### Running tests

You can use the yarn script executing the following command. This will run `jest` tests in watch mode.

```shell
yarn test
```

To check out coverage, use this handy script.

```shell
yarn coverage
```

If you need more fancy stuff, you after running the above command, open coverage report in your browser.

```shell
open ./coverage/lcov-report/index.html
```
