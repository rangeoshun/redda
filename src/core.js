'use strict'

import undef from './consts'
import { sc_tags } from './dom_syms.js'
import _ from './utils'

export const str_style_attr = (val) =>
  (!_.is_str(val) && val) || _.str(`${val}`)

export const str_style = (attrs) => {
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

const is_style = (key) => key === 'style'
const is_value = (key) => key === 'value'
const is_handl = (key) => key.match(/^on/)

export const str_attrs = (attrs, handlrs) => {
  if (!_.is_obj(attrs)) return ''

  return _.reduc(_.keys_of(attrs), '', (acc, key) => {
    const trans_key_ = _.transform_key(_.str(key))
    const trans_key = is_handl(trans_key_)
      ? handlrs.key(trans_key_)
      : trans_key_
    const conc = `${acc} ${trans_key}=`

    const val = _.get(attrs, key)

    if (is_style(trans_key)) return conc + `"${str_style(val)}"`

    if (is_handl(trans_key)) return conc + `"${handlrs.reg(trans_key_, val)}"`

    if (_.is_null(val)) return acc

    return conc + `"${_.is_str(val) ? val : _.str(val)}"`
  })
}

export const str_inner = (jsonml, html_arr = [], handlrs) =>
  _.reduc(jsonml, html_arr, (acc, inner) => {
    if (_.is_str(inner)) return [...acc, inner]
    if (_.is_arr(inner)) return build_html(inner, acc, handlrs)

    return acc
  })

const is_sc = (tag) => sc_tags.includes(_.sym(tag))

export const open_tag = (type, attrs, handlrs) =>
  `<${_.transform_key(type)}${str_attrs(attrs, handlrs)}${
    is_sc(type) ? ' /' : ''
  }>`

export const close_tag = (type) =>
  !is_sc(type) ? `</${_.transform_key(type)}>` : ''

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
  handlrs,
  nodes
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

export const elem = (fn) => (attrs, ...cont) => {
  if (_.is_obj(attrs)) return fn(attrs, ...cont)

  return fn({}, attrs, ...cont)
}

export const update_build_html = (jsonml = [], node, handlrs) => {
  let [first, second, ...rest] = jsonml

  if (node.childNodes.length && _.is_arr(first)) {
    update_nodes(jsonml, node.childNodes, handlrs)
    return
  }

  node.innerHTML = to_html(jsonml, handlrs, node)
}

const update_text_node = (text, node) =>
  node.data !== text && (node.data = text)

const update_node = (elem, node, handlrs) => {
  if (!elem || !node) return

  const [first, second, ...rest] = elem

  if (is_text(node)) {
    update_text_node(elem, node)
    return
  }

  if (_.is_obj(second)) {
    const attrs = node.attributes
    const elem_keys = _.keys_of(second)

    attrs &&
      _.vals_of(attrs).forEach((attr) => {
        if (!attr || _.is_def(second[attr])) return

        node[attr] = null
        node.removeAttribute(attr)
      })

    elem_keys.forEach((key) => {
      const val = second[key]

      if (is_style(key)) {
        if (!val) {
          node.removeAttribute(key)
          return
        }

        _.keys_of(val).forEach((key) => (node.style[key] = val[key]))
        return
      }

      if (is_handl(key)) {
        node.setAttribute(handlrs.key(key), handlrs.reg(key, val))
        return
      }

      if (is_value(key)) {
        val !== node.value && (node.removeAttribute(key), (node.value = val))
        return
      }

      if (_.is_def(val)) node.setAttribute(key, val), (node[key] = val)
      else node.removeAttribute(key)
    })

    const child_nodes = node.childNodes

    if (!_.is_empty(rest) && _.is_empty(child_nodes)) {
      update_build_html(rest, node, handlrs)
      return
    }

    update_nodes(rest, child_nodes, handlrs)
    return
  }

  if (!second) return

  update_nodes([second, ...rest], node.childNodes, handlrs)
}

const buffer_node = document.createElement('div')

const to_nodes = (jsonml, handlrs) => {
  buffer_node.innerHTML = to_html(jsonml, handlrs)

  return buffer_node.childNodes
}

const update_nodes = (
  [elem, ...rest_elems],
  [node, ...rest_nodes],
  handlrs
) => {
  if (node && !is_match(elem, node)) {
    node.parentNode.removeChild(node)
    update_node([elem, ...rest_elems], rest_nodes, handlrs)
    return
  }

  if (!_.is_empty(rest_elems) && _.is_empty(rest_nodes) && node) {
    to_nodes(rest_elems, handlrs).forEach((new_node) =>
      node.parentNode.appendChild(new_node)
    )
  }

  update_node(elem, node, handlrs)

  if (_.is_empty(rest_elems) && !_.is_empty(rest_nodes)) {
    rest_nodes.forEach((node) => node.parentNode.removeChild(node))
  }

  if (_.is_empty(rest_elems)) return

  update_nodes(rest_elems, rest_nodes, handlrs)
}

const is_text = (node) => node && node.nodeName === '#text'

const is_match = (elem, node) => {
  if (!node || !elem) return false

  if (_.is_str(elem) && is_text(node)) return true

  const [first_, second, ...rest] = elem
  const first = _.is_sym(first_) ? _.sym_to_str(first_) : first_

  return first === node.localName
}

const render_ = (handlrs) => (node, app) => {
  const render = () => (
    handlrs.detach(),
    handlrs.reset(),
    update_build_html([to_jsonml(app)], node, handlrs),
    handlrs.attach()
  )

  render()

  return render
}

export default render_
