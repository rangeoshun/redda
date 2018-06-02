'use strict'

import { undef } from './const'
import {
  iff,
  add_to,
  add,
  is_arr,
  is_str,
  str,
  get,
  reduc,
  keys_of,
  transform_key
} from './utils'

const str_attrs = attrs =>
  reduc(keys_of(attrs), '', (acc, key) =>
    add(acc, ` ${transform_key(str(key))}="${str(get(attrs, key))}"`)
  )

const str_inner = html_arr => jsonml =>
  reduc(jsonml, '', (inner, acc) =>
    iff(
      is_str(inner),
      add_to(html_arr, inner),
      iff(is_arr(inner), str_tag(inner))
    )
  )

const start_tag = subj => add('<', transform_key(subj))

const str_tag = html_arr => jsonml => undef

const jsonml_to_html = jsonml => undef

export { str_attrs, str_inner, start_tag, str_tag, jsonml_to_html }
