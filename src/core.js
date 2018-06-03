'use strict'

const undef = require('./const')
const {
  iff,
  add,
  is_def,
  is_obj,
  is_arr,
  is_str,
  str,
  get,
  join,
  reduc,
  keys_of,
  transform_key
} = require('./utils')

const str_attrs = attrs =>
  (is_obj(attrs) &&
    reduc(
      keys_of(attrs),
      '',
      (acc, key) =>
        `${acc} ${transform_key(str(key))}="${str(get(attrs, key))}"`
    )) ||
  ''

const str_inner = (jsonml, html_arr = []) =>
  reduc(
    jsonml,
    html_arr,
    (acc, inner) =>
      (is_str(inner) && [...acc, inner]) ||
      (is_arr(inner) && to_html(inner, acc))
  )

const open_tag = (type, attrs) => `<${transform_key(type)}${str_attrs(attrs)}>`

const close_tag = type => `</${transform_key(type)}>`

const to_html = ([first, second, ...rest], html_arr = []) => [
  ...html_arr,
  ...((is_arr(first) && str_inner(first)) ||
    (is_str(first) && [
      open_tag(first, is_obj(second) && second),
      ...str_inner([...((is_arr(second) && [second]) || []), ...rest]),
      close_tag(first)
    ]))
]

module.exports = { str_attrs, str_inner, open_tag, close_tag, to_html }
