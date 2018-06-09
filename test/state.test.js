import state, { frag } from '../src/state'

test('#frag', () => expect(frag({ foo: 1 })()).toEqual({ foo: 1 }))

const state_get = state({ foo: 1 })

test('state#get', () => expect(state_get.get()).toEqual({ foo: 1 }))

const state_add = state()
const frag_1 = () => ({ bar: 1 })
const frag_2 = frag({ baz: 2 })

state_add.add(frag_1)
state_add.add(frag_2)

test('state#add', () =>
  expect(state_add.get()).toMatchObject({
    [Symbol.for(frag_1.name)]: { bar: 1 },
    [Symbol.for(frag_2.name)]: { baz: 2 }
  }))

const state_disp = state()
const toggle_active = state => ({ ...state, active: !state['active'] })
const foo_feat = () => ({ active: false })
state_disp.add(foo_feat, toggle_active)
state_disp.disp(toggle_active)

test('state#disp', () => (
  expect(state_disp.get()).toMatchObject({
    [Symbol.for(foo_feat)]: { active: true }
  }),
  expect().toEqual()
))

const state_conn = state()
const frag_conn = () => ({ foo: 1 })
state_conn.add(frag_conn)
const mock_elem = (state, attrs, ...cont) => JSON.stringify(state)
const conn_elem = state_conn.conn(mock_elem, frag_conn)

test('state#connect', () => expect(conn_elem()).toBe('{"frag_conn":{"foo":1}}'))
