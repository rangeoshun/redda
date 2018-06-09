'use strict'

import undef from './consts'
import _ from './utils'

export const reducs_sym = _.sym(':reducs')
const _init_state = { [reducs_sym]: {} }

export const frag = (init_state, ...reducs) => {
  const reducr_map = {}

  _.reduc(reducs, {}, (acc, reducr) => ({
    ...acc,
    [_.sym(reducr)]: reducr
  }))

  return (state = init_state, reducr) =>
    (!_.is_fn(reducr) && state) || reducr_map[_.sym(reducr)](state)
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

const disp = (state, reducr) => {
  const reducs = state[reducs_sym]

  return _.reduc(_.keys_of(reducs), state, (acc, frag_name) => ({
    ...acc,
    [frag_name]: reducs[frag_name](state[frag_name], reducr)
  }))
}

const state = (state_ = _init_state) => {
  const get = () => state_
  const set = new_state => (state_ = new_state)

  return {
    add: (init_frag, ...reducers) => set(add(get(), init_frag, ...reducers)),
    conn: (elem, ...frags) => conn(get, elem, ...frags),
    disp: reducr => set(disp(get(), reducr)),
    get
  }
}

export default state
