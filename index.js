'use strict'

const noop = () => null

const is_def = subj => subj != undefined

const add = (a, b) => a + b

const str = subject => add(subject, '')

const is_str = subj => typeof subj == 'string'

const iff = (cond, then, other) => (cond ? then() : other())

const has_length = arr => !!arr.length

const reduce = ([first, ...rest] = [], acc = [], fn = noop) =>
  iff(
    is_def(first) || has_length(rest),
    () => reduce(rest, fn(first, acc), fn),
    () => acc
  )

const flow = (subj, ...fns) => reduce(fns, fn => fn(subj))

const to_lower = subj => subj.toLowerCase()

const sanitize = subj => escape(subj)

const transform_key = subj => flow(subj, to_lower, sanitize)

const str_attrs = attrs =>
  reduce(attrs.keys, '', (key, res) =>
    add(res, ` ${transform_key(str(key))}="${str(attrs[key])}"`)
  )

const str_inner = jsonml => reduce(jsonml, '', (inner, acc) => null)

const jsnml_to_html_string = jsonml => null
