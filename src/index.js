'use strict'

import consts from './consts'
import dom from './dom_syms'
import render_ from './core'
import utils from './utils'
import state from './state'
import handlrs_ from './handlrs'

const handlrs = handlrs_()
const render = render_(handlrs)

export default {
  consts,
  dom,
  render,
  handlrs,
  utils,
  state
}
