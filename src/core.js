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

const is_style = key => key === 'style'
const is_handl = key => key.match(/^on/)

export const str_attrs = (attrs, handlrs) => {
  if (!_.is_obj(attrs)) return ''

  return _.reduc(_.keys_of(attrs), '', (acc, key) => {
    const trans_key = _.transform_key(_.str(key))
    const conc = `${acc} ${trans_key}=`
    const val = _.get(attrs, key)

    if (is_style(trans_key)) return conc + `"${str_style(val)}"`

    if (is_handl(trans_key)) {
      const handlr_id = handlrs.reg(val)
      return conc + `"redda.handlrs.get()['${handlr_id}'](event)"`
    }

    return conc + `"${_.str(val)}"`
  })
}

export const str_inner = (jsonml, html_arr = [], handlrs) =>
  _.reduc(jsonml, html_arr, (acc, inner) => {
    if (_.is_str(inner)) return [...acc, inner]
    if (_.is_arr(inner)) return build_html(inner, acc, handlrs)

    return acc
  })

export const open_tag = (type, attrs, handlrs) =>
  `<${_.transform_key(type)}${str_attrs(attrs, handlrs)}>`

export const close_tag = type => `</${_.transform_key(type)}>`

export const wrap_tag = (handlrs, first, second, ...rest) => {
  const inner = (!_.is_obj(second) && [second]) || []

  return [
    open_tag(first, _.is_obj(second) && second, handlrs),
    ...str_inner([...inner, ...rest], [], handlrs),
    close_tag(first)
  ]
}

export const build_html = (
  [first, second, ...rest] = [],
  html = [],
  handlrs
) => {
  if (_.is_arr(first))
    return [...html, ...str_inner([first, second, ...rest], [], handlrs)]

  if (_.is_str(first))
    return [...html, ...wrap_tag(handlrs, first, second, ...rest)]

  if (_.is_sym(first))
    return [...html, ...wrap_tag(handlrs, _.sym_to_str(first), second, ...rest)]

  return html
}

export const to_html = (jsonml, handlrs) =>
  _.join(build_html(jsonml, [], handlrs))

export const to_jsonml = ([first, ...rest] = []) => {
  if (_.is_str(first) || _.is_sym(first) || _.is_obj(first))
    return _.compress([first, ...to_jsonml(rest)])

  if (_.is_arr(first)) return _.compress([to_jsonml(first), ...to_jsonml(rest)])
  if (_.is_fn(first)) return _.compress(to_jsonml(elem(first)(...rest)))

  return []
}

export const elem = fn => (attrs, ...cont) => {
  if (_.is_obj(attrs)) return fn(attrs, ...cont)

  return fn({}, attrs, ...cont)
}

export default handlrs => (node, app) => {
  const shadow = node.attachShadow({ mode: 'closed' })
  const render = () => (
    handlrs.reset(), (shadow.innerHTML = to_html(to_jsonml(app), handlrs))
  )

  render()

  return render
}
