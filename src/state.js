'use strict'

import undef from './consts'
import _ from './utils'

const reducs_sym = _.sym(':reducs')
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
      [name]: state[_.sym(name)]
    })),
    args
  ])

const disp = (state, reducr) => {
  const reducs = state[reducs_sym]

  return _.reduc(_.keys_of(reducs), {}, frag_name => ({
    ...state,
    [frag_name]: reducs[frag_name](state[frag_name], reducr)
  }))
}

const state = (state = _init_state) => ({
  add: (init_frag, ...reducers) => (state = add(state, init_frag, ...reducers)),
  conn: (elem, ...frags) => conn(state, elem, ...frags),
  disp: reducr => (state = disp(state, reducr)),
  get: sym => (sym && state && state[sym]) || state
})

export default state
