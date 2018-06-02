'use strict'
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
