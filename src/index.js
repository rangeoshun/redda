'use strict'

import utils from './utils'

const str_attrs = attrs =>
  reduce(keys_of(attrs), '', (acc, key) =>
    add(acc, ` ${transform_key(str(key))}="${str(get(attrs, key))}"`)
  )

const str_inner = html_arr => jsonml =>
  reduce(jsonml, '', (inner, acc) =>
    iff(
      is_str(inner),
      add_to(html_arr, inner),
      iff(is_arr(inner), str_tag(inner))
    )
  )

const start_tag = subj => add('<', transform_key(subj))

const str_tag = html_arr => jsonml => undef // TODO: find a reducer for the createTag port

const jsnml_to_html_string = jsonml => undef

const div = sym('div')

// App

const app_style = {
  display: 'flex'
}

const header_style = {
  height: '50px',
  flex_shrink: 0
}

const header = (attrs = {}, ...cont) => [
  div,
  { id: 'head', style: header_style, ...attrs },
  'Title',
  ...cont
]

const body = (attrs = {}, ...cont) => [
  div,
  { id: 'body', ...attrs },
  'Nice app',
  ...cont
]

const app = () => [div, { id: 'app', style: app_style }, header, body]

/*
function createTag ( jsonml ) {

    var i = 0;

    if (jsonml[i] instanceof _ARRAY) {

        createInner(jsonml);
        return;
    }

    var htmlFrag = '<' + jsonml[0].toLowerCase();
    i++;

    if (jsonml[i] instanceof _OBJECT && !(jsonml[i] instanceof _ARRAY)) {

        htmlFrag += createAttributes(jsonml[i]);
        i++;
    }

    htmlFrag += '>';
    htmlArray.push(htmlFrag);

    if (typeof jsonml[i] === _STRING_STRING) {

        htmlArray.push(jsonml[i]);
        i++;
    }

    if (i < jsonml.length) {
        createInner(jsonml.splice(i, jsonml.length - i));
    }

    htmlArray.push('</' + jsonml[0].toLowerCase() + '>');
}
*/
