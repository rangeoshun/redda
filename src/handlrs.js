'use strict'

import { rnd_id, keys_of, reduc, repl, split } from './utils'

const reg = (store, handlr, handlr_key) => {
  const handlr_id = rnd_id()

  const new_store = {
    ...store,
    [handlr_key + '-' + handlr_id]: handlr
  }
  return [handlr_id, new_store]
}

const key = (val) => val + '-key'

const detach = (event, handlr_id, handlr) => {
  const node = document.querySelector(`[${key(event)}="${handlr_id}"]`)
  const ev_name = repl(event, /^on/, '')

  return node.removeEventListener(ev_name, handlr)
}

const attach = (event, handlr_id, handlr) => {
  const node = document.querySelector(`[${key(event)}="${handlr_id}"]`)
  const ev_name = repl(event, /^on/, '')

  return node.addEventListener(ev_name, handlr)
}

const handlrs = (store_) => {
  store_ = {}

  return {
    get: () => store_,
    reset: () => (store_ = {}),
    key: (val) => key(val),
    detach: () =>
      keys_of(store_).forEach((key) => {
        const [handlr_key, handlr_id] = split(key, '-')
        const handlr = store_[key]

        detach(handlr_key, handlr_id, handlr)
      }),
    attach: () =>
      keys_of(store_).forEach((key) => {
        const [handlr_key, handlr_id] = split(key, '-')
        const handlr = store_[key]

        attach(handlr_key, handlr_id, handlr)
      }),
    reg: (event, handlr) => {
      const [handlr_id, new_store] = reg(store_, handlr, event)
      store_ = new_store

      return handlr_id
    }
  }
}

export default handlrs
