'use strict'

import consts from './consts'
import dom from './dom_syms'
import renderer from './core'
import utils from './utils'
import state from './state'
import handlrs from './handlrs'

const render = renderer(handlrs)

export default {
  consts,
  dom,
  render,
  utils,
  state,
}
