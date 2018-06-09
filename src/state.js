'use strict'

import undef from './consts'
import _ from './utils'

const add = (state = {}, frag) => ({ ...state, [_.sym(frag.name)]: frag() })

const connect = state => (elem = _.noop, ...frags) => (...args) =>
  elem.apply(null, [
    _.reduce(frags, {}, (frag_state, { name }) => ({
      ...frag_state,
      [name]: state[_.sym(name)]
    })),
    args
  ])

const state = (state = {}) => ({
  add: frag => (state = add(state, frag)),
  connect: connect(state),
  get: () => state
})

export default state
