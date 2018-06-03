'use strict'

const undef = require('./const')
const { div } = require('./dom_syms.js')
const {
  iff,
  add,
  is_def,
  is_obj,
  is_arr,
  is_str,
  is_sym,
  sym_to_str,
  is_fn,
  str,
  get,
  join,
  reduc,
  keys_of,
  transform_key,
  has_len,
  compress
} = require('./utils')

const str_style_attr = val => (!is_str(val) && val) || str(`'${val}'`)

const str_style = attrs =>
  (is_obj(attrs) &&
    reduc(
      keys_of(attrs),
      '',
      (acc, key) =>
        `${acc} ${transform_key(str(key))}: ${str_style_attr(get(attrs, key))};`
    )) ||
  ''

const str_attrs = attrs =>
  (is_obj(attrs) &&
    reduc(
      keys_of(attrs),
      '',
      (acc, key) =>
        (key == 'style' &&
          `${acc} ${transform_key(str(key))}="${str_style(
            get(attrs, key)
          )}"`) ||
        `${acc} ${transform_key(str(key))}="${str(get(attrs, key))}"`
    )) ||
  ''

const str_inner = (jsonml, html_arr = []) =>
  reduc(
    jsonml,
    html_arr,
    (acc, inner) =>
      (is_str(inner) && [...acc, inner]) ||
      (is_arr(inner) && build_html(inner, acc))
  )

const open_tag = (type, attrs) => `<${transform_key(type)}${str_attrs(attrs)}>`

const close_tag = type => `</${transform_key(type)}>`

const wrap_tag = (first, second, ...rest) => [
  open_tag(first, is_obj(second) && second),
  ...str_inner([...((is_arr(second) && [second]) || []), ...rest]),
  close_tag(first)
]

const build_html = ([first, second, ...rest] = [], html_arr = []) => [
  ...html_arr,
  ...((is_arr(first) && str_inner(first)) ||
    (is_str(first) && wrap_tag(first, second, ...rest)) ||
    (is_sym(first) && wrap_tag(sym_to_str(first), second, ...rest)))
]

const to_html = jsonml => join(build_html(jsonml))

const to_jsonml = ([first, ...rest] = []) =>
  compress(
    ((is_str(first) || is_sym(first) || is_obj(first)) && [
      first,
      ...to_jsonml(rest)
    ]) ||
      (is_arr(first) && [to_jsonml(first), ...to_jsonml(rest)]) ||
      (is_fn(first) && to_jsonml(first(rest))) ||
      []
  )

module.exports = {
  str_style,
  str_attrs,
  str_inner,
  open_tag,
  close_tag,
  to_html,
  to_jsonml
}
