const {
  str_style,
  str_attrs,
  str_inner,
  open_tag,
  close_tag,
  to_html,
  to_jsonml
} = require('../src/core')

test(
  str_style.name,
  () => (
    expect(str_style({ foo: 1, bar: 'bar' })).toBe(" foo: 1; bar: 'bar';"),
    expect(str_style({ FOO: 1, bar_baz: 'bar' })).toBe(
      " foo: 1; bar-baz: 'bar';"
    )
  )
)
test(
  str_attrs.name,
  () => (
    expect(str_attrs({ foo: 'foo', bar: 'bar' })).toBe(' foo="foo" bar="bar"'),
    expect(str_attrs({ FOO: 'foo', bar_baz: 'bar' })).toBe(
      ' foo="foo" bar-baz="bar"'
    ),
    expect(
      str_attrs({ foo: { bar: 'bar' }, style: { FOO: 1, bar_baz: 'bar' } })
    ).toBe(' foo="{"bar":"bar"}" style=" foo: 1; bar-baz: \'bar\';"')
  )
)

test(
  open_tag.name,
  () => (
    expect(open_tag('div')).toBe('<div>'),
    expect(open_tag('DIV')).toBe('<div>'),
    expect(open_tag('FOO_bar>')).toBe('<foo-bar>'),
    expect(open_tag('<!@>#@#%$%&?FOO>')).toBe('<foo>'),
    expect(open_tag('p', { foo: 'foo' })).toBe('<p foo="foo">')
  )
)

test(
  close_tag.name,
  () => (
    expect(close_tag('div')).toBe('</div>'),
    expect(close_tag('DIV?>??!@')).toBe('</div>')
  )
)

test(
  str_inner.name,
  () => (
    expect(str_inner(['foo'], ['<br>'])).toEqual(['<br>', 'foo']),
    expect(str_inner(['foo', ['div', { foo: 'foo' }]])).toEqual([
      'foo',
      '<div foo="foo">',
      '</div>'
    ])
  )
)

test(
  to_html.name,
  () => (
    expect(to_html(['div', { width: 300, data_foo: { bar: 'bar' } }])).toEqual([
      '<div width="300" data-foo="{"bar":"bar"}">',
      '</div>'
    ]),
    expect(to_html(['div', ['div']])).toEqual([
      '<div>',
      '<div>',
      '</div>',
      '</div>'
    ]),
    expect(to_html([Symbol.for('div')])).toEqual(['<div>', '</div>'])
  )
)

test(
  to_jsonml.name,
  () => (
    expect(to_jsonml()).toEqual([]),
    expect(to_jsonml([])).toEqual([]),
    expect(to_jsonml(['div'])).toEqual(['div']),
    expect(to_jsonml(['div', { id: 'foo' }])).toEqual(['div', { id: 'foo' }]),
    expect(
      to_jsonml([
        ([attrs, ...cont]) => ['div', attrs, ...cont],
        { id: 'foo' },
        ['div']
      ])
    ).toEqual(['div', { id: 'foo' }, ['div']]),
    expect(
      to_jsonml([
        ([attrs, ...cont]) => ['div', attrs, ...cont],
        { id: 'foo' },
        () => ['div']
      ])
    ).toEqual(['div', { id: 'foo' }, ['div']])
  )
)
