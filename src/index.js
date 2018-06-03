'use strict'
const { div } = require('./dom_syms')
const { to_jsonml, to_html } = require('./core')

// App

const app_style = {
  display: 'flex'
}

const header_style = {
  height: '50px',
  flex_shrink: 0
}

const header = () => [div, { id: 'head', style: header_style }, 'Title']

const body = () => [div, { id: 'body' }, 'Nice app']

const app = () => ['div', { id: 'app', style: app_style }, [header], [body]]

console.log(to_html(to_jsonml([app])))
