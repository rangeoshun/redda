'use strict'

const undef = require('./const')
const { div } = require('./dom_syms.js')
const _ = require('./utils')

const str_style_attr = val => (!_.is_str(val) && val) || _.str(`${val}`)

const str_style = attrs =>
  (_.is_obj(attrs) &&
    _.trim(
      _.reduc(
        _.keys_of(attrs),
        '',
        (acc, key) =>
          `${acc} ${_.transform_key(_.str(key))}: ${str_style_attr(
            _.get(attrs, key)
          )};`
      )
    )) ||
  ''

const str_attrs = attrs =>
  (_.is_obj(attrs) &&
    _.reduc(
      _.keys_of(attrs),
      '',
      (acc, key) =>
        (key == 'style' &&
          `${acc} ${_.transform_key(_.str(key))}="${str_style(
            _.get(attrs, key)
          )}"`) ||
        `${acc} ${_.transform_key(_.str(key))}="${_.str(_.get(attrs, key))}"`
    )) ||
  ''

const str_inner = (jsonml, html_arr = []) =>
  _.reduc(
    jsonml,
    html_arr,
    (acc, inner) =>
      (_.is_str(inner) && [...acc, inner]) ||
      (_.is_arr(inner) && build_html(inner, acc))
  )

const open_tag = (type, attrs) =>
  `<${_.transform_key(type)}${str_attrs(attrs)}>`

const close_tag = type => `</${_.transform_key(type)}>`

const wrap_tag = (first, second, ...rest) => [
  open_tag(first, _.is_obj(second) && second),
  ...str_inner([...((_.is_arr(second) && [second]) || []), ...rest]),
  close_tag(first)
]

const build_html = ([first, second, ...rest] = [], html_arr = []) => [
  ...html_arr,
  ...((_.is_arr(first) && str_inner(first)) ||
    (_.is_str(first) && wrap_tag(first, second, ...rest)) ||
    (_.is_sym(first) && wrap_tag(_.sym_to_str(first), second, ...rest)))
]

const to_html = jsonml => _.join(build_html(jsonml))

const to_jsonml = ([first, ...rest] = []) =>
  _.compress(
    ((_.is_str(first) || _.is_sym(first) || _.is_obj(first)) && [
      first,
      ...to_jsonml(rest)
    ]) ||
      (_.is_arr(first) && [to_jsonml(first), ...to_jsonml(rest)]) ||
      (_.is_fn(first) && to_jsonml(first(rest))) ||
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
