# redda
A functional approach to a JSONML based UI

## Description

The goal of the project is to create a UI framework that reads data and produces HTML. The basis is to use [JSONML](http://www.jsonml.org/) and augment it with the ability to use functions or symbols as `tag-name`.

### Basic example

```javascript
const { div } = redda.dom

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

redda.core(document.getElementById('app-cont'), [app])
```

The example above should render the app as seen below. Note, `div#app-cont` should exist in the dom.

```html
<div id="app-cont">
  <div id="app" style=" display: flex;">
    <div id="head" style="height: 50px; flex-shrink: 0;">Title</div>
    <div id="body">Nice app</div>
  </div>
</div>
```

### Elements

Elements are the basic building blocks that Redda uses to display content. All JSONML are valid elements. On top of that it can be a function returning a JSONML. One notable mention is that a Redda element can use a `Symbol` as tag name for example `Symbol.for('div')`. All native HTML5 elements are mapped to symbols accessable from `redda.dom` by destructuring.

#### The basic jsonml

```javascript
const basic_element = ['div', { class: 'fancy' }, "Content text"]

// This rendered would result in the following
// >> <div class="fancy">Content text</div>
```

### State

Redda uses a Redux like state management. It is designed to use a single state and you can connect your elements via a connector function provided by the state instance.

#### Create a state

## To come

- [x] State management
- [ ] Event handling
- [ ] Meaningful error messages
- [ ] Other goodies

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

### Building

Use rollup to bundle package via:

```shell
yarn build
```
