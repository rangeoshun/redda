# Redda
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

#### The basic JSONML

```javascript
const basic_element = ['div', { class: 'fancy' }, "Content text"]

// ...
```
```html
<div class="fancy">Content text</div>
```

```javascript
const { div } = redda.dom
const sym_element = [div, { class: 'fancy' }, "Content text"]

// ...
```
```html
<div class="fancy">Content text</div>
```

#### Function elements

Elements as mentioned above can be functions to break out of staticity. Functional elements should be thought like "tags". The most basic usage would be like this.

```javascript
const { div } = redda.dom
const fn_element = () => [div, { class: 'fancy' }, "Content text"]
const app = [fn_element]

// ...
```
```html
<div class="fancy">Content text</div>
```

That does note display all the possibilities using functions. When we say you need to think about them as "tags", we mean it *can* be used as tags, in which case it will receive it's "context" as arguments. Please consider the following example.

```javascript
const { div } = redda.dom
const fn_element = (attrs, ...cont) => [div, { ...attrs, class: 'fancy' }, ...cont]
const app = [fn_element, { id: 'your_elem' }, "Content provided outside"]

// ...
```
```html
<div id="your_elem" class="fancy">Content provided outside</div>
```

As seen the function used as a tag receives arguments. The first one is an `Object`, and the rest of the encolsing `Array` is considered to be the content, and is spreaded for our function. If the item following our function is not an object, an empty object will be passed instead to keep signature consistent.

```javascript
const { div } = redda.dom
const fn_element = (attrs, ...cont) => [div, { ...attrs, class: 'fancy' }, ...cont]
const app = [fn_element, "Content provided outside", "and some more"]

// ...
```
```html
<div class="fancy">Content provided outside and some more</div>
```
### State

All applications has a state. To solve this, Redda uses a Redux like state store with actions. There are some differences tho.

#### The state store

To create a state store just instantitate one.

```javascript
const state = redda.state()
```

This will handle state management through fragments registered and actions dispatched which will be familiar if you've used Redux before. The state in the previous example will return an object providing the state management methods you'll need. One of these is `get`, which will return current state. It's still empty tho.

```javascript
state.get() // => {}
```

#### Adding a fragment

A fragment is very simple. It's a named function, returning the initial value for the fragment. The name will be used to register the fregment by. To make this clear please see the exampel below, keeping in mind we created a state in the previous.

```javascript
const fragment = () => ({ value: 0 })

state.add(fragment)
```

We now officially have more then an empty state. Getting state will be as follows.

```javascript
{
  "fragment": { value: 0 }
}
```

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
