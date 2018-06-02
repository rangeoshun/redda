import {
  noop,
  add,
  str,
  sym,
  sym_to_str,
  is_def,
  is_str,
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
} from '../src/utils'

test('#noop', () => expect(noop()).toBe(undefined))

test('#is_def', () => (
  expect(is_def(null)).toBe(true),
  expect(is_def(0)).toBe(true),
  expect(is_def(1)).toBe(true),
  expect(is_def('')).toBe(true),
  expect(is_def([])).toBe(true),
  expect(is_def({})).toBe(true),
  expect(is_def(undefined)).toBe(false),
  expect(is_def()).toBe(false)
))

test('#add', () => (
  expect(add(1, 1)).toBe(2),
  expect(add('1', '1')).toBe('11'),
  expect(add('1', 1)).toBe('11')
))

test('#str', () => (
  expect(str()).toBe('undefined'),
  expect(str('foo')).toBe('foo'),
  expect(str(1)).toBe('1'),
  expect(str([])).toBe(''),
  expect(str({})).toBe('[object Object]')
))

test('#sym', () => (
  expect(sym('foo')).toBe(Symbol.for('foo')),
  expect(sym(noop)).toBe(Symbol.for('noop'))
))
