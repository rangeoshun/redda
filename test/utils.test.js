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
  is_in,
  uniq,
  to_lower,
  sanitize,
  to_dashed,
  transform_key,
  add_to,
  reduc,
  keys_of,
  get,
  has_len,
  repl
} from '../src/utils'

test(noop.name, () => expect(noop()).toBe(undefined))

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

test(
  add.name,
  () => (
    expect(add(1, 1)).toBe(2),
    expect(add('1', '1')).toBe('11'),
    expect(add('1', 1)).toBe('11')
  )
)

test(
  str.name,
  () => (
    expect(str()).toBe('undefined'),
    expect(str('foo')).toBe('foo'),
    expect(str(1)).toBe('1'),
    expect(str([])).toBe(''),
    expect(str({})).toBe('[object Object]')
  )
)

test(
  is_in.name,
  () => expect(is_in(1, [1, 2])).toBe(true),
  expect(is_in(1, [2, 3])).toBe(false),
  expect(is_in('a', ['a', 'b', 'c'])).toBe(true)
)

test(
  uniq.name,
  () => (
    expect(uniq([1, 1, 2, 2])).toEqual([1, 2]),
    expect(uniq(['a', 'a', 'b', 'b'])).toEqual(['a', 'b'])
  )
)

test(
  repl.name,
  () => (
    expect(repl('abc', 'b', 'c')).toBe('acc'),
    expect(repl('abc', 'b')).toBe('ac')
  )
)

test(
  sym.name,
  () => (
    expect(sym(0)).toBe(Symbol.for(0)),
    expect(sym('foo')).toBe(Symbol.for('foo')),
    expect(sym(noop)).toBe(Symbol.for('noop'))
  )
)

test(sym_to_str.name, () => expect(sym_to_str(Symbol.for('foo'))).toBe('foo'))

test(
  has_len.name,
  () => (expect(has_len([1, 2, 3])).toBe(true), expect(has_len([])).toBe(false))
)

test(
  reduc.name,
  () => (
    expect(reduc([1, 1, 1], 0, (acc, item) => acc + item)).toBe(3),
    expect(reduc([], 0, (acc, item) => acc + item)).toBe(0),
    expect(reduc(undefined, undefined, (acc, item) => acc + item)).toBe(
      undefined
    ),
    expect(reduc([1], 0, (acc, item) => 'foo')).toBe('foo')
  )
)

test(
  flow.name,
  () => (
    expect(flow(val => val + 1, val => val + 1)(0)).toBe(2),
    expect(flow(val => true, val => false)(0)).toBe(false),
    expect(flow()()).toBe()
  )
)

test(to_lower.name, () => expect(to_lower('FOO')).toBe('foo'))

test(sanitize.name, () =>
  expect(sanitize('<foo-OOO_!@#$%^&&*(?){} />')).toBe('foo-')
)

test(to_dashed.name, () => expect(to_dashed('foo_bar')).toBe('foo-bar'))

test(transform_key.name, () =>
  expect(transform_key('<FOO_bar>')).toBe('foo-bar')
)
