import _ from '../src/utils'
const { noop } = _

test('#noop', () => expect(_.noop()).toBe(undefined))

test('#pass', () => expect(_.pass(1)).toBe(1))

test('#is_def', () => (
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
))

test('#is_str', () => (
  expect(_.is_str(undefined)).toBe(false),
  expect(_.is_str(1)).toBe(false),
  expect(_.is_str(null)).toBe(false),
  expect(_.is_str({})).toBe(false),
  expect(_.is_str([])).toBe(false),
  expect(_.is_str(noop)).toBe(false),
  //
  expect(_.is_str('foo')).toBe(true)
))

test('#is_fn', () => (
  expect(_.is_fn(undefined)).toBe(false),
  expect(_.is_fn(1)).toBe(false),
  expect(_.is_fn(null)).toBe(false),
  expect(_.is_fn([])).toBe(false),
  expect(_.is_fn('foo')).toBe(false),
  expect(_.is_fn({})).toBe(false),
  //
  expect(_.is_fn(noop)).toBe(true)
))

test('#is_obj', () => (
  expect(_.is_obj(undefined)).toBe(false),
  expect(_.is_obj(1)).toBe(false),
  expect(_.is_obj(null)).toBe(false),
  expect(_.is_obj([])).toBe(false),
  expect(_.is_obj('foo')).toBe(false),
  //
  expect(_.is_obj({})).toBe(true)
))

test('#add', () => (
  expect(_.add(1, 1)).toBe(2),
  expect(_.add('1', '1')).toBe('11'),
  expect(_.add('1', 1)).toBe('11')
))

test('#str', () => (
  expect(_.str()).toBe('undefined'),
  expect(_.str('foo')).toBe('foo'),
  expect(_.str(1)).toBe('1'),
  expect(_.str([])).toBe('[]'),
  expect(_.str({})).toBe('{}')
))

test('#is_in', () => (
  expect(_.is_in(1, [1, 2])).toBe(true),
  expect(_.is_in(1, [2, 3])).toBe(false),
  expect(_.is_in('a', ['a', 'b', 'c'])).toBe(true)
))

test('#uniq', () => (
  expect(_.uniq([1, 1, 2, 2])).toEqual([1, 2]),
  expect(_.uniq(['a', 'a', 'b', 'b'])).toEqual(['a', 'b'])
))

test('#repl', () => (
  expect(_.repl('abc', 'b', 'c')).toBe('acc'),
  expect(_.repl('abc', 'b')).toBe('ac')
))

test('#sym', () => (
  expect(_.sym(0)).toBe(Symbol.for(0)),
  expect(_.sym('foo')).toBe(Symbol.for('foo')),
  expect(_.sym(noop)).toBe(Symbol.for('noop'))
))

test('#sym_to_str', () => expect(_.sym_to_str(Symbol.for('foo'))).toBe('foo'))

test('#has_len', () => (
  expect(_.has_len([1, 2, 3])).toBe(true), expect(_.has_len([])).toBe(false)
))

test('#reduc', () => (
  expect(_.reduc([1, 1, 1], 0, (acc, item) => acc + item)).toBe(3),
  expect(_.reduc([], 0, (acc, item) => acc + item)).toBe(0),
  expect(_.reduc(undefined, undefined, (acc, item) => acc + item)).toBe(
    undefined
  ),
  expect(_.reduc([1], 0, (acc, item) => 'foo')).toBe('foo')
))

test('#flow', () => (
  expect(
    _.flow(
      val => val + 1,
      val => val + 1
    )(0)
  ).toBe(2),
  expect(
    _.flow(
      val => true,
      val => false
    )(0)
  ).toBe(false),
  expect(_.flow()()).toBe()
))

test('#to_lower', () => expect(_.to_lower('FOO')).toBe('foo'))

test('#sanitize', () =>
  expect(_.sanitize('<foo-1OOO_!@#$%^&&*(?){} />')).toBe('foo-1'))

test('#to_dashed', () => expect(_.to_dashed('foo_bar')).toBe('foo-bar'))

test('#transform_key', () =>
  expect(_.transform_key('<FOO_bar1>')).toBe('foo-bar1'))

test('#add_to', () => expect(_.add_to([], 1)).toEqual([1]))

test('#keys_of', () =>
  expect(_.keys_of({ foo: 1, bar: 2, [_.sym('baz')]: 3 })).toEqual([
    'foo',
    'bar'
  ]))

test('#syms_of', () =>
  expect(_.syms_of({ [_.sym('foo')]: 1, [_.sym('bar')]: 2, baz: 3 })).toEqual([
    _.sym('foo'),
    _.sym('bar')
  ]))

test('#get', () => (
  expect(_.get({ foo: 1, bar: 2 }, 'foo')).toBe(1),
  expect(_.get([1, 2], 0)).toBe(1)
))

test('#trim', () => expect(_.trim(' a ')).toBe('a'))

test('#is_sym', () => (
  expect(_.is_sym(undefined)).toBe(false),
  expect(_.is_sym(1)).toBe(false),
  expect(_.is_sym(null)).toBe(false),
  expect(_.is_sym({})).toBe(false),
  expect(_.is_sym([])).toBe(false),
  expect(_.is_sym(noop)).toBe(false),
  expect(_.is_sym('foo')).toBe(false),
  //
  expect(_.is_sym(Symbol.for('foo'))).toBe(true)
))

test('#is_null', () => (
  expect(_.is_null(undefined)).toBe(false),
  expect(_.is_null(1)).toBe(false),
  expect(_.is_null({})).toBe(false),
  expect(_.is_null([])).toBe(false),
  expect(_.is_null(noop)).toBe(false),
  expect(_.is_null('foo')).toBe(false),
  expect(_.is_null(Symbol.for('foo'))).toBe(false),
  //
  expect(_.is_null(null)).toBe(true)
))

test('#is_empty', () => (
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
))

test(
  '#compress',
  () => expect(_.compress([null, undefined, '', {}, [], 0])).toEqual(['', 0]),
  expect(_.compress([null, undefined, '', { foo: 1 }, [1], 0])).toEqual([
    '',
    { foo: 1 },
    [1],
    0
  ])
)

test('#rnd_id', () => {
  const ids = Array(1000)
    .fill(undefined)
    .map((_, i) => i)
    .map(_.rnd_id)

  expect(_.uniq(ids).length).toBe(ids.length)
})
