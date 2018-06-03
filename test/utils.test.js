import _ from '../src/utils'
const { noop } = _

test(_.noop.name, () => expect(_.noop()).toBe(undefined))

test(
  _.is_def.name,
  () => (
    expect(_.is_def(undefined)).toBe(false),
    expect(_.is_def()).toBe(false),
    //
    expect(_.is_def(null)).toBe(true),
    expect(_.is_def(0)).toBe(true),
    expect(_.is_def(1)).toBe(true),
    expect(_.is_def('')).toBe(true),
    expect(_.is_def([])).toBe(true),
    expect(_.is_def({})).toBe(true),
    expect(_.is_def(noop)).toBe(true)
  )
)

test(
  _.is_str.name,
  () => (
    expect(_.is_str(undefined)).toBe(false),
    expect(_.is_str(1)).toBe(false),
    expect(_.is_str(null)).toBe(false),
    expect(_.is_str({})).toBe(false),
    expect(_.is_str([])).toBe(false),
    expect(_.is_str(noop)).toBe(false),
    //
    expect(_.is_str('foo')).toBe(true)
  )
)

test(
  _.is_fn.name,
  () => (
    expect(_.is_fn(undefined)).toBe(false),
    expect(_.is_fn(1)).toBe(false),
    expect(_.is_fn(null)).toBe(false),
    expect(_.is_fn([])).toBe(false),
    expect(_.is_fn('foo')).toBe(false),
    expect(_.is_fn({})).toBe(false),
    //
    expect(_.is_fn(noop)).toBe(true)
  )
)

test(
  _.is_obj.name,
  () => (
    expect(_.is_obj(undefined)).toBe(false),
    expect(_.is_obj(1)).toBe(false),
    expect(_.is_obj(null)).toBe(false),
    expect(_.is_obj([])).toBe(false),
    expect(_.is_obj('foo')).toBe(false),
    //
    expect(_.is_obj({})).toBe(true)
  )
)

test(
  _.add.name,
  () => (
    expect(_.add(1, 1)).toBe(2),
    expect(_.add('1', '1')).toBe('11'),
    expect(_.add('1', 1)).toBe('11')
  )
)

test(
  _.str.name,
  () => (
    expect(_.str()).toBe('undefined'),
    expect(_.str('foo')).toBe('foo'),
    expect(_.str(1)).toBe('1'),
    expect(_.str([])).toBe('[]'),
    expect(_.str({})).toBe('{}')
  )
)

test(
  _.is_in.name,
  () => expect(_.is_in(1, [1, 2])).toBe(true),
  expect(_.is_in(1, [2, 3])).toBe(false),
  expect(_.is_in('a', ['a', 'b', 'c'])).toBe(true)
)

test(
  _.uniq.name,
  () => (
    expect(_.uniq([1, 1, 2, 2])).toEqual([1, 2]),
    expect(_.uniq(['a', 'a', 'b', 'b'])).toEqual(['a', 'b'])
  )
)

test(
  _.repl.name,
  () => (
    expect(_.repl('abc', 'b', 'c')).toBe('acc'),
    expect(_.repl('abc', 'b')).toBe('ac')
  )
)

test(
  _.sym.name,
  () => (
    expect(_.sym(0)).toBe(Symbol.for(0)),
    expect(_.sym('foo')).toBe(Symbol.for('foo')),
    expect(_.sym(noop)).toBe(Symbol.for('noop'))
  )
)

test(_.sym_to_str.name, () =>
  expect(_.sym_to_str(Symbol.for('foo'))).toBe('foo')
)

test(
  _.has_len.name,
  () => (
    expect(_.has_len([1, 2, 3])).toBe(true), expect(_.has_len([])).toBe(false)
  )
)

test(
  _.reduc.name,
  () => (
    expect(_.reduc([1, 1, 1], 0, (acc, item) => acc + item)).toBe(3),
    expect(_.reduc([], 0, (acc, item) => acc + item)).toBe(0),
    expect(_.reduc(undefined, undefined, (acc, item) => acc + item)).toBe(
      undefined
    ),
    expect(_.reduc([1], 0, (acc, item) => 'foo')).toBe('foo')
  )
)

test(
  _.flow.name,
  () => (
    expect(_.flow(val => val + 1, val => val + 1)(0)).toBe(2),
    expect(_.flow(val => true, val => false)(0)).toBe(false),
    expect(_.flow()()).toBe()
  )
)

test(_.to_lower.name, () => expect(_.to_lower('FOO')).toBe('foo'))

test(_.sanitize.name, () =>
  expect(_.sanitize('<foo-OOO_!@#$%^&&*(?){} />')).toBe('foo-')
)

test(_.to_dashed.name, () => expect(_.to_dashed('foo_bar')).toBe('foo-bar'))

test(_.transform_key.name, () =>
  expect(_.transform_key('<FOO_bar>')).toBe('foo-bar')
)

test(
  _.iff.name,
  () => expect(_.iff(true, () => true, () => false)).toBe(true),
  expect(_.iff(false, () => true, () => false)).toBe(false),
  expect(_.iff(false, () => true)).toBe(undefined)
)

test(_.add_to.name, () => expect(_.add_to([], 1)).toEqual([1]))

test(_.keys_of.name, () =>
  expect(_.keys_of({ foo: 1, bar: 2 })).toEqual(['foo', 'bar'])
)

test(
  _.get.name,
  () => expect(_.get({ foo: 1, bar: 2 }, 'foo')).toBe(1),
  expect(_.get([1, 2], 0)).toBe(1)
)

test(_.trim.name, () => expect(_.trim(' a ')).toBe('a'))

test(
  _.is_sym.name,
  () => (
    expect(_.is_sym(undefined)).toBe(false),
    expect(_.is_sym(1)).toBe(false),
    expect(_.is_sym(null)).toBe(false),
    expect(_.is_sym({})).toBe(false),
    expect(_.is_sym([])).toBe(false),
    expect(_.is_sym(noop)).toBe(false),
    expect(_.is_sym('foo')).toBe(false),
    //
    expect(_.is_sym(Symbol.for('foo'))).toBe(true)
  )
)

test(
  _.is_null.name,
  () => (
    expect(_.is_null(undefined)).toBe(false),
    expect(_.is_null(1)).toBe(false),
    expect(_.is_null({})).toBe(false),
    expect(_.is_null([])).toBe(false),
    expect(_.is_null(noop)).toBe(false),
    expect(_.is_null('foo')).toBe(false),
    expect(_.is_null(Symbol.for('foo'))).toBe(false),
    //
    expect(_.is_null(null)).toBe(true)
  )
)

test(
  _.is_empty.name,
  () => (
    expect(_.is_empty(1)).toBe(false),
    expect(_.is_empty(noop)).toBe(false),
    expect(_.is_empty('foo')).toBe(false),
    expect(_.is_empty(Symbol.for('foo'))).toBe(false),
    expect(_.is_empty({ foo: 1 })).toBe(false),
    expect(_.is_empty([1])).toBe(false),
    //
    expect(_.is_empty(undefined)).toBe(true),
    expect(_.is_empty(null)).toBe(true),
    expect(_.is_empty({})).toBe(true),
    expect(_.is_empty([])).toBe(true)
  )
)

test(
  _.compress.name,
  () => expect(_.compress([null, undefined, '', {}, [], 0])).toEqual(['', 0]),
  expect(_.compress([null, undefined, '', { foo: 1 }, [1], 0])).toEqual([
    '',
    { foo: 1 },
    [1],
    0
  ])
)
