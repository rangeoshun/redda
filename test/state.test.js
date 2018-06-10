import state, { frag, reducs_sym } from '../src/state'

test('#frag', () => expect(frag({ foo: 1 })()).toEqual({ foo: 1 }))

const state_get = state()

test('state#get', () => expect(state_get.get()).toEqual({}))

const state_add = state()
const frag_1 = () => ({ bar: 1 })
const frag_2 = frag({ baz: 2 })

state_add.add(frag_1)
state_add.add(frag_2)

test('state#add', () =>
  expect(state_add.get()).toMatchObject({
    [frag_1.name]: { bar: 1 },
    [frag_2.name]: { baz: 2 }
  }))

const state_disp = state()
const set_active = (state, flag) => ({ ...state, active: flag })
const foo_feat = () => ({ name: 'foo', active: false })
state_disp.add(foo_feat, set_active)
state_disp.disp(set_active, true)

test('state#disp', () =>
  expect(state_disp.get()).toEqual({
    ...state_disp.get(),
    [foo_feat.name]: { name: 'foo', active: true }
  }))

const state_disp_args = state()

const state_conn = state()
const frag_conn = () => ({ foo: 1 })
const inc_foo = ({ foo, ...state }) => ({ ...state, foo: foo + 1 })
state_conn.add(frag_conn, inc_foo)
const mock_elem = (state, attrs, ...cont) => JSON.stringify(state)
state_conn.disp(inc_foo)
const conn_elem = state_conn.conn(mock_elem, frag_conn)
state_conn.disp(inc_foo)

test('state#connect', () => expect(conn_elem()).toBe('{"frag_conn":{"foo":3}}'))
