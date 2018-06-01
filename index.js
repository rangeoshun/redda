'use strict'

// Utils

const undef = undefined

const noop = () => undef

const is_def = subj => subj != undef

const add = (a, b) => a + b

const str = subj => add(subj, '')

const sym = subj => Symbol.for(subj)

const sym_to_str = sym => Symbol.keyFor(sym)

const is_str = subj => typeof subj == 'string'

const is_arr = subj => subj instanceof Array

const is_obj = subj => subj instanceof Object

const iff = (cond, then = noop, other = noop) => (cond ? then() : other())

const has_length = arr => !!arr.length

const reduce = ([first, ...rest] = [], acc = [], fn = noop, index_ = 0) =>
  iff(
    is_def(first) || has_length(rest),
    () => reduce(rest, fn(acc, first, index_), fn),
    () => acc
  )

const flow = (subj, ...fns) => reduce(fns, fn => fn(subj))

const to_lower = subj => str(subj).toLowerCase()

const sanitize = subj => escape(subj)

const transform_key = subj => flow(subj, to_lower, sanitize)

const add_to = (arr, subj) => arr.push(subj)

const keys_of = subj => Object.keys(subj)

const get = (subj = {}, key) => subj[key]

const str_attrs = attrs =>
  reduce(keys_of(attrs), '', (acc, key) =>
    add(acc, ` ${transform_key(str(key))}="${str(get(attrs, key))}"`)
  )

const str_inner = html_arr => jsonml =>
  reduce(jsonml, '', (inner, acc) =>
    iff(
      is_str(inner),
      add_to(html_arr, inner),
      iff(is_arr(inner), str_tag(inner))
    )
  )

const start_tag = subj => add('<', transform_key(subj))

const str_tag = html_arr => jsonml => undef // TODO: find a reducer for the createTag port

const jsnml_to_html_string = jsonml => undef

const elem = (type, attrs, ...cont) => (attrs = {}, cont = undef) => [
  type,
  attrs,
  cont
]

const div = sym('div')

// App

const app_style = {
  display: 'flex'
}

const header_style = {
  height: '50px',
  flex_shrink: 0
}

const header = (attrs = {}) => [
  div,
  { id: 'head', style: header_style, ...attrs },
  'Title'
]

const body = (attrs = {}) => [div, { id: 'body', ...attrs }, 'Nice app']

const app = () => [div, { id: 'app', style: app_style }, header, body]
