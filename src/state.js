'use strict'

import undef from './consts'
import _ from './utils'

export const reducs_sym = _.sym(':reducs')
export const on_change_sym = _.sym(':on_change')
const _init_state = { [reducs_sym]: {}, [on_change_sym]: [] }

export const frag = (init_state, ...reducs) => {
  const reducr_map = _.reduc(reducs, {}, (acc, reducr) => ({
    ...acc,
    [_.sym(reducr)]: reducr
  }))

  return (state = init_state, reducr, ...args) => {
    const fn = reducr_map[_.sym(reducr)]

    if ((!_.is_fn(reducr) && _.is_def(state)) || !_.is_fn(fn)) return state

    return reducr_map[_.sym(reducr)](state, ...args)
  }
}

const add = (state = _init_state, init_frag, ...reducers) => {
  const sym = _.sym(init_frag)
  const reducr = frag(init_frag(), ...reducers)

  return {
    ...state,
    [sym]: reducr(),
    [reducs_sym]: { ...state[reducs_sym], [sym]: reducr }
  }
}

const conn = (state, elem = _.noop, ...frags) => (...args) =>
  elem.apply(null, [
    _.reduc(frags, {}, (frag_state, { name }) => ({
      ...frag_state,
      [name]: state()[_.sym(name)]
    })),
    args
  ])

const disp = (state, reducr, ...args) => {
  const reducs = state[reducs_sym]

  return _.reduc(_.syms_of(reducs), state, (acc, frag_name) => ({
    ...acc,
    [frag_name]: reducs[frag_name](state[frag_name], reducr, ...args)
  }))
}

const call_on_change = cbs => _.reduc(cbs, null, (_, cb) => cb())

const get_state = state =>
  _.reduc(_.syms_of(state), {}, (acc, key) => {
    if (key == reducs_sym || key == on_change_sym) return acc

    return {
      ...acc,
      [_.sym_to_str(key)]: state[key]
    }
  })

const state = state_ => {
  state_ = { ...state_, ..._init_state }

  const get = () => ({ ...state_ })
  const set = new_state => ((state_ = new_state), undef)

  return {
    add: (init_frag, ...reducrs) => set(add(get(), init_frag, ...reducrs)),
    conn: (elem, ...frags) => conn(get, elem, ...frags),
    disp: (reducr, ...args) => (
      set(disp(get(), reducr, ...args)), call_on_change(get()[on_change_sym])
    ),
    on_change: fn =>
      set({ ...get(), [on_change_sym]: [...get()[on_change_sym], fn] }),

    get: () => get_state(get())
  }
}

export default state
