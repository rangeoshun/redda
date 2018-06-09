'use strict'

import undef from './consts'
import _ from './utils'

const add = state => (frag = _.noop) =>
  (state = { ...state, [_.sym(frag.name)]: frag() })

const connect = state => (elem = _.noop, ...frags) => (...args) =>
  elem.apply(null, [
    ...args,
    _.reduce(frags, {}, (frag_state, { name }) => ({
      ...frag_state,
      [name]: state[_.sym(name)]
    }))
  ])

const state = (state = {}) => ({
  add: add(state),
  connect: connect(state),
  get: () => state
})

export default state
