'use strict'

import { undef } from './const'

const noop = _ => undef

const is_def = subj => subj !== undef

const is_str = subj => typeof subj == 'string'

const is_fn = subj => typeof subj == 'function'

const is_arr = subj => subj instanceof Array

const is_obj = subj => subj instanceof Object

const iff = (cond, then = noop, other = noop) => (cond ? then() : other())

const add = (a, b) => a + b

const str = subj => add(subj, '')

const repl = (subj, char, with_char = '') => subj.replace(char, with_char)

const sym = subj => iff(is_fn(subj), _ => sym(subj.name), _ => Symbol.for(subj))

const sym_to_str = sym => Symbol.keyFor(sym)

const has_len = arr => !!arr.length

const is_in = (subj, arr = []) =>
  reduc(arr, false, (acc, item) => acc || item == subj)

const join = (subj = [], joiner = '') => is_fn(subj.join) && subj.join(joiner)

const uniq = subj =>
  reduc(subj, [], (acc, item) =>
    iff(is_in(item, acc), _ => acc, _ => [...acc, item])
  )

const split = (subj = {}, by = '') =>
  iff(is_def(by) && is_fn(subj.split), _ => subj.split(by))

const reduc = ([first, ...rest] = [], acc = undef, fn = noop, index_ = 0) =>
  iff(
    is_def(first) || has_len(rest),
    _ => reduc(rest, fn(acc, first, index_), fn),
    _ => acc
  )

const flow = (...fns) => subj => reduc(fns, subj, (acc, fn) => fn(acc))

const to_lower = subj => str(subj).toLowerCase()

const sanitize = subj =>
  repl(subj, RegExp(`[${join(uniq(split(repl(subj, /[a-z-]/g, ''))))}]`, 'g'))

const to_dashed = subj => repl(subj, '_', '-')

const transform_key = subj => flow(to_lower, to_dashed, sanitize)(subj)

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
  has_len,
  is_in,
  join,
  uniq,
  flow,
  to_lower,
  sanitize,
  to_dashed,
  transform_key,
  add_to,
  reduc,
  keys_of,
  get,
  repl
}
