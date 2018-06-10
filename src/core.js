'use strict'

import undef from './consts'
import _ from './utils'

export const str_style_attr = val => (!_.is_str(val) && val) || _.str(`${val}`)

export const str_style = attrs => {
  if (!_.is_obj(attrs)) return ''

  return _.trim(
    _.reduc(
      _.keys_of(attrs),
      '',
      (acc, key) =>
        `${acc} ${_.transform_key(_.str(key))}: ${str_style_attr(
          _.get(attrs, key)
        )};`
    )
  )
}

export const str_attrs = attrs => {
  if (!_.is_obj(attrs)) return ''

  return _.reduc(
    _.keys_of(attrs),
    '',
    (acc, key) =>
      (key == 'style' &&
        `${acc} ${_.transform_key(_.str(key))}="${str_style(
          _.get(attrs, key)
        )}"`) ||
      `${acc} ${_.transform_key(_.str(key))}="${_.str(_.get(attrs, key))}"`
  )
}

export const str_inner = (jsonml, html_arr = []) =>
  _.reduc(jsonml, html_arr, (acc, inner) => {
    if (_.is_str(inner)) return [...acc, inner]
    if (_.is_arr(inner)) return build_html(inner, acc)
    return acc
  })

export const open_tag = (type, attrs) =>
  `<${_.transform_key(type)}${str_attrs(attrs)}>`

export const close_tag = type => `</${_.transform_key(type)}>`

export const wrap_tag = (first, second, ...rest) => {
  const inner = (!_.is_obj(second) && [second]) || []

  return [
    open_tag(first, _.is_obj(second) && second),
    ...str_inner([...inner, ...rest]),
    close_tag(first)
  ]
}

export const build_html = ([first, second, ...rest] = [], html = []) => {
  if (_.is_arr(first)) return [...html, ...str_inner([first, second, ...rest])]

  if (_.is_str(first)) return [...html, ...wrap_tag(first, second, ...rest)]

  if (_.is_sym(first))
    return [...html, ...wrap_tag(_.sym_to_str(first), second, ...rest)]

  return html
}

export const to_html = jsonml => _.join(build_html(jsonml))

export const to_jsonml = ([first, ...rest] = []) => {
  if (_.is_str(first) || _.is_sym(first) || _.is_obj(first))
    return _.compress([first, ...to_jsonml(rest)])

  if (_.is_arr(first)) return _.compress([to_jsonml(first), ...to_jsonml(rest)])

  if (_.is_fn(first)) return _.compress(to_jsonml(first(rest)))

  return []
}
export const elem = fn => (attrs, ...cont) => {
  if (_.is_obj(attrs)) return fn(attrs, ...cont)

  return fn({}, attrs, ...cont)
}

export default (node, app) => {
  console.log(to_html(to_jsonml(app)))
  const render = () => (node.innerHTML = to_html(to_jsonml(app)))

  render()

  return render
}
