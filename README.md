# Redda
A functional approach to a JSONML based UI

## Description

The goal of the project is to create a UI framework that reads data and produces HTML. The basis is to use [JSONML](http://www.jsonml.org/) and augment it with the ability to use functions or symbols as `tag-name`.

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

### Rendering

To render our app we use the method `render` provided by Redda. This needs an element to render your app into, and the app itself as follows. The former is a native DOM Node, the latter is a JSONML array.

```javascript
const { h1 } = redda.dom
const render = redda.render(document.getElementById('app-cont'), [h1, 'Hello World!'])
```

Render will automatically render your app into the desired container node, and also return a function to trigger rerender. It will render like this.

```html
<div id="app-cont">
  <h1>Hello World!</h1>
</div>
```

### State

All applications has a state. To solve this, Redda uses a Redux like state store with actions. There are some differences tho.

> **Caution!** Redda's state uses function names to identify state fragments and actions to dispatch. You'll need to `export` and `import` your fragments and actions once defined.

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

A fragment is very simple. It's a named function, returning the initial value for the fragment. The name will be used to register the fregment by. To make this clear please see the exampel below, keeping in mind we created a state in the previous. We'll use the method `add`.

```javascript
const fragment = () => ({ value: 0 })

state.add(fragment)

state.get() // => { "fragment": { "value": 0 } }

```

We now officially have more then an empty state.

#### Actions and dispatching them

Actions are also simple named functions. They differ from fragments in that they receive the current state to operate on and return a new state. Similar to how you would do with Redux. Let's follow the example we started with some adjustments.

```javascript
const set_value = ({ value, ...state }) => ({ ...state, value: value + 1 })
```

We need to register this along the fragment we created to make it use it. We can reuse this action with any other fragment we create. To dispatch it use the method provided by state as `disp`.

```javascript
state.add(fragment, set_value)

state.disp(set_value, 1)

state.get() // => { "fragment": { "value": 1 } }
```

#### Connecting elements with state

This is where we make use of our state. We take a simple element as described above and connect it to our state. Still following the example we used. Please note that the signature of the element with state changes, as the first argument is the state, followed by the attributes and content.

```javascript
const { h1 } = redda.dom
const element = ({ fragment: { value } }, attrs, ...cont) =>
  [h1, { ...attrs }, `Value is ${value}`, ...cont]
```

To connect the element use the state provided method `conn`. First we need to specify the element we want to connect and then we provide the fragments we want to connect. We use the reference for these.

```javascript
const element_with_fragment = state.conn(element, fragment)
state.disp(set_value, 2)
```

Now, whenever we call our new method returned by `conn`, it'll be provided with the current state. This is an object with keys by the name of the fragments, holding the actual values of those in the state store. Rendering our element we'll see it.

```html
<h1>Value is 2</h1>
```

#### Rerender app on state change

To reflect state changes we need to use the state's `on_change` method and pass the `render` method provided by `redda.render(...)`.

```javascript
const render_app = redda.render(document.getElementById('app-cont'), [element_with_fragment])

state.on_change(render_app)
```

Now, after `state.disp(set_value, 3)` our app will rerender and look like this:

```html
<h1>Value is 3</h1>
```

## Examples

To see an example please clone repo and browse the examples folder.

```shell
$ https://github.com/rangeoshun/redda.git
$ cd redda
$ open examples/clock/index.html
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
