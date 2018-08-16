'use strict'

import { rnd_id, keys_of, reduc } from './utils'

const reg = (store, handlr) => {
  const handlr_id = rnd_id()

  const new_store = {
    ...store,
    [handlr_id]: handlr
  }
  return [handlr_id, new_store]
}

const handlrs = store_ => {
  store_ = {}

  return {
    get: () => store_,
    reset: () =>
      (store_ = reduc(
        keys_of(store_),
        (store, key) => (delete store[key], store)
      )),
    reg: handlr => {
      const [handlr_id, new_store] = reg(store_, handlr)
      store_ = new_store

      return handlr_id
    }
  }
}

export default handlrs
