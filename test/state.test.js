import state from '../src/state'

const state_get = state({ foo: 1 })

test('state#get', () => expect(state_get.get()).toEqual({ foo: 1 }))

const state_add = state()
const frag_1 = () => ({ bar: 1 })
const frag_2 = () => ({ baz: 2 })

state_add.add(frag_1)
state_add.add(frag_2)

test('state#add', () =>
  expect(state_add.get()).toEqual({
    [Symbol.for(frag_1.name)]: { bar: 1 },
    [Symbol.for(frag_2.name)]: { baz: 2 }
  }))

const state_conn = state({ foo: 1 })
const mock_elem = (got_state, [attrs, ...cont]) => null

// test('state#connect', () => expect())
