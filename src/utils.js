'use strict'

import { undef } from './const'

const noop = () => undef

const is_def = subj => subj !== undef

const is_str = subj => typeof subj == 'string'

const is_fn = subj => typeof subj == 'function'

const is_arr = subj => subj instanceof Array

const is_obj = subj => subj instanceof Object

const iff = (cond, then = noop, other = noop) => (cond ? then() : other())

const add = (a, b) => a + b

const str = subj => add(subj, '')

const sym = subj =>
  iff(is_fn(subj), () => sym(subj.name), () => Symbol.for(subj))

const sym_to_str = sym => Symbol.keyFor(str(sym))

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

export {
  noop,
  add,
  str,
  sym,
  sym_to_str,
  is_def,
  is_str,
  is_fn,
  is_arr,
  is_obj,
  flow,
  to_lower,
  sanitize,
  transform_key,
  add_to,
  reduce,
  keys_of,
  get,
  has_length
}
