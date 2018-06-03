'use strict'

const { undef } = require('./const')

const noop = () => undef

const is_null = subj => subj === null

const is_def = subj => subj !== undef

const is_str = subj => typeof subj == 'string'

const is_fn = subj => typeof subj == 'function'

const is_arr = subj => subj instanceof Array

const is_obj = subj =>
  !is_str(subj) && !is_arr(subj) && !is_fn(subj) && subj instanceof Object

const is_sym = subj => typeof subj == 'symbol'

const iff = (cond, then = noop, other = noop) => (cond ? then() : other())

const trim = subj => repl(str(subj), /[\s\n]/g)

const add = (a, b) => a + b

const str = subj =>
  ((is_str(subj) || !is_def(subj)) && add(subj, '')) || JSON.stringify(subj)

const repl = (subj, char, with_char = '') => subj.replace(char, with_char)

const sym = subj =>
  iff(is_fn(subj), () => sym(subj.name), () => Symbol.for(subj))

const sym_to_str = sym => Symbol.keyFor(sym)

const has_len = arr => !!arr.length

const is_in = (subj, arr = []) =>
  reduc(arr, false, (acc, item) => acc || item == subj)

const join = (subj = [], joiner = '') => is_fn(subj.join) && subj.join(joiner)

const uniq = subj =>
  reduc(subj, [], (acc, item) =>
    iff(is_in(item, acc), () => acc, () => [...acc, item])
  )

const split = (subj = {}, by = '') =>
  iff(is_def(by) && is_fn(subj.split), () => subj.split(by))

const reduc = ([first, ...rest] = [], acc = undef, fn = noop, index_ = 0) =>
  iff(
    is_def(first) || has_len(rest),
    () => reduc(rest, fn(acc, first, index_), fn),
    () => acc
  )

const flow = (...fns) => subj => reduc(fns, subj, (acc, fn) => fn(acc))

const to_lower = subj => str(subj).toLowerCase()

const sanitize = subj =>
  repl(subj, RegExp(`[${join(uniq(split(repl(subj, /[a-z-]/g, ''))))}]`, 'g'))

const to_dashed = subj => repl(subj, '_', '-')

const transform_key = subj => flow(to_lower, to_dashed, sanitize)(subj)

const add_to = (arr, subj) => [...arr, subj]

const keys_of = subj => Object.keys(subj)

const get = (subj = {}, key) => subj[key]

const is_empty = subj =>
  is_null(subj) ||
  !is_def(subj) ||
  (is_arr(subj) && !has_len(subj)) ||
  (is_obj(subj) && !has_len(keys_of(subj)))

const compress = (subj = []) =>
  reduc(
    subj,
    [],
    (acc, item) =>
      (is_def(item) && !is_null(item) && !is_empty(item) && [...acc, item]) ||
      acc
  )

module.exports = {
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
  is_empty
}
