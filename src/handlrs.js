'use strict'

import { rnd_id } from './utils'

const reg = (store, handlr) => {
  handlr_id = rnd_id()

  const new_store = {
    ...store,
    [handlr_id]: handlr
  }
  return [handlr_id, new_store]
}

const handlrs = store_ => {
  store_ = {}

  return {
    reset: () => (store_ = {}),
    reg: handlr => {
      const [handlr_id, new_store] = reg(store, handlr)
      store_ = new_store

      return handlr_id
    }
  }
}

export default handlrs
