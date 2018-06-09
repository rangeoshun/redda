'use strict'

import { undef } from './consts'

const noop = () => undef
const pass = _ => _

export const is_null = subj => subj === null

export const is_def = subj => subj !== undef

export const is_str = subj => typeof subj == 'string'

export const is_fn = subj => typeof subj == 'function'

export const is_arr = subj => subj instanceof Array

export const is_obj = subj =>
  !is_str(subj) && !is_arr(subj) && !is_fn(subj) && subj instanceof Object

export const is_sym = subj => typeof subj == 'symbol'

export const iff = (cond, then = noop, other = noop) =>
  cond ? then() : other()

export const trim = (subj = '') => subj.trim && subj.trim()

export const add = (a, b) => a + b

export const str = subj =>
  ((is_str(subj) || !is_def(subj)) && add(subj, '')) || JSON.stringify(subj)

export const repl = (subj, char, with_char = '') =>
  subj.replace(char, with_char)

export const sym = subj =>
  iff(is_fn(subj), () => sym(subj.name), () => Symbol.for(subj))

export const sym_to_str = sym => Symbol.keyFor(sym)

export const has_len = arr => !!arr.length

export const is_in = (subj, arr = []) =>
  reduc(arr, false, (acc, item) => acc || item == subj)

export const join = (subj = [], joiner = '') =>
  is_fn(subj.join) && subj.join(joiner)

export const uniq = subj =>
  reduc(subj, [], (acc, item) =>
    iff(is_in(item, acc), () => acc, () => [...acc, item])
  )

export const split = (subj = {}, by = '') =>
  iff(is_def(by) && is_fn(subj.split), () => subj.split(by))

export const reduc = (
  [first, ...rest] = [],
  acc = undef,
  fn = noop,
  index_ = 0
) =>
  iff(
    is_def(first) || has_len(rest),
    () => reduc(rest, fn(acc, first, index_), fn),
    () => acc
  )

export const flow = (...fns) => subj => reduc(fns, subj, (acc, fn) => fn(acc))

export const to_lower = subj => str(subj).toLowerCase()

export const sanitize = subj =>
  repl(subj, RegExp(`[${join(uniq(split(repl(subj, /[a-z-]/g, ''))))}]`, 'g'))

export const to_dashed = subj => repl(subj, '_', '-')

export const transform_key = subj => flow(to_lower, to_dashed, sanitize)(subj)

export const add_to = (arr, subj) => [...arr, subj]

export const keys_of = subj => Object.keys(subj)

export const get = (subj = {}, key) => subj[key]

export const is_empty = subj =>
  is_null(subj) ||
  !is_def(subj) ||
  (is_arr(subj) && !has_len(subj)) ||
  (is_obj(subj) && !has_len(keys_of(subj)))

export const compress = (subj = []) =>
  reduc(
    subj,
    [],
    (acc, item) =>
      (is_def(item) && !is_null(item) && !is_empty(item) && [...acc, item]) ||
      acc
  )

export const rnd_id = seed =>
  ((new Date().getMilliseconds() + seed) * Math.PI + seed)
    .toString(16)
    .replace('.', '')

export default {
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
  is_sym,
  is_null,
  has_len,
  is_in,
  iff,
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
  repl,
  trim,
  compress,
  is_empty,
  rnd_id,
  pass
}
