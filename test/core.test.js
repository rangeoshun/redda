import { str_attrs, start_tag } from '../src/core'

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

test(
  start_tag.name,
  () => (
    expect(start_tag('div')).toBe('<div'),
    expect(start_tag('DIV')).toBe('<div'),
    expect(start_tag('<!@>#@#%$%&?FOO_bar')).toBe('<foo-bar')
  )
)
