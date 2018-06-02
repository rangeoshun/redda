import { str_attrs } from '../src/core'

test(
  str_attrs.name,
  () => (
    expect(str_attrs({ foo: 'foo', bar: 'bar' })).toBe(' foo="foo" bar="bar"'),
    expect(str_attrs({ FOO: 'foo', bar_baz: 'bar' })).toBe(
      ' foo="foo" bar-baz="bar"'
    ),
    expect(str_attrs({ foo: { bar: 'bar' } })).toBe(' foo="{"bar":"bar"}"')
  )
)
