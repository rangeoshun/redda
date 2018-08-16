'use strict'

import consts from './consts'
import dom from './dom_syms'
import renderer from './core'
import utils from './utils'
import state from './state'
import handlrs_ from './handlrs'

const handlrs = handlrs_()
const render = renderer(handlrs)

export default {
  consts,
  dom,
  render,
  handlrs,
  utils,
  state
}
