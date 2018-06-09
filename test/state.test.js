import state from '../src/state'

const state_get = state({ foo: 1 })

test(state_get.get.name, () => expect(state_get.get()).toEqual({ foo: 1 }))

const state_add = state({ foo: 1 })
const frag = () => ({ bar: 1 })

state_add.add(frag)

test(state_add.add.name, () =>
  expect(state_add.get()).toEqual({
    foo: 1,
    [Symbol.for(frag.name)]: { bar: 1 }
  })
)
