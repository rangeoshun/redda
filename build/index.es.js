const undef = undefined;

var consts = {
  undef
};

const noop = () => undef;

const is_null = subj => subj === null;

const is_def = subj => subj !== undef;

const is_str = subj => typeof subj == 'string';

const is_fn = subj => typeof subj == 'function';

const is_arr = subj => subj instanceof Array;

const is_obj = subj => !is_str(subj) && !is_arr(subj) && !is_fn(subj) && subj instanceof Object;

const is_sym = subj => typeof subj == 'symbol';

const iff = (cond, then = noop, other = noop) => cond ? then() : other();

const trim = (subj = '') => subj.trim && subj.trim();

const add = (a, b) => a + b;

const str = subj => (is_str(subj) || !is_def(subj)) && add(subj, '') || JSON.stringify(subj);

const repl = (subj, char, with_char = '') => subj.replace(char, with_char);

const sym = subj => iff(is_fn(subj), () => sym(subj.name), () => Symbol.for(subj));

const sym_to_str = sym => Symbol.keyFor(sym);

const has_len = arr => !!arr.length;

const is_in = (subj, arr = []) => reduc(arr, false, (acc, item) => acc || item == subj);

const join = (subj = [], joiner = '') => is_fn(subj.join) && subj.join(joiner);

const uniq = subj => reduc(subj, [], (acc, item) => iff(is_in(item, acc), () => acc, () => [...acc, item]));

const split = (subj = {}, by = '') => iff(is_def(by) && is_fn(subj.split), () => subj.split(by));

const reduc = ([first, ...rest] = [], acc = undef, fn = noop, index_ = 0) => iff(is_def(first) || has_len(rest), () => reduc(rest, fn(acc, first, index_), fn), () => acc);

const flow = (...fns) => subj => reduc(fns, subj, (acc, fn) => fn(acc));

const to_lower = subj => str(subj).toLowerCase();

const sanitize = subj => repl(subj, RegExp(`[${join(uniq(split(repl(subj, /[a-z-]/g, ''))))}]`, 'g'));

const to_dashed = subj => repl(subj, '_', '-');

const transform_key = subj => flow(to_lower, to_dashed, sanitize)(subj);

const add_to = (arr, subj) => [...arr, subj];

const keys_of = subj => Object.keys(subj);

const get = (subj = {}, key) => subj[key];

const is_empty = subj => is_null(subj) || !is_def(subj) || is_arr(subj) && !has_len(subj) || is_obj(subj) && !has_len(keys_of(subj));

const compress = (subj = []) => reduc(subj, [], (acc, item) => is_def(item) && !is_null(item) && !is_empty(item) && [...acc, item] || acc);

var _ = {
  noop,
  add,
  str,
  sym,
  sym_to_str,
  is_def,
  is_str,
  is_fn,
  is_arr,
  is_obj,
  is_sym,
  is_null,
  has_len,
  is_in,
  iff,
  join,
  uniq,
  flow,
  to_lower,
  sanitize,
  to_dashed,
  transform_key,
  add_to,
  reduc,
  keys_of,
  get,
  repl,
  trim,
  compress,
  is_empty
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

const tags = ['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'bgsound', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command', 'content', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'image', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'listing', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'multicol', 'nav', 'nextid', 'nobr', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'plaintext', 'pre', 'progress', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'slot', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr', 'xmp'];

const syms = _.reduc(tags, {}, (acc, tag) => _extends({}, acc, {
  [tag]: Symbol.for(tag)
}));

_extends({}, syms);

const str_style_attr = val => !_.is_str(val) && val || _.str(`${val}`);

const str_style = attrs => _.is_obj(attrs) && _.trim(_.reduc(_.keys_of(attrs), '', (acc, key) => `${acc} ${_.transform_key(_.str(key))}: ${str_style_attr(_.get(attrs, key))};`)) || '';

const str_attrs = attrs => _.is_obj(attrs) && _.reduc(_.keys_of(attrs), '', (acc, key) => key == 'style' && `${acc} ${_.transform_key(_.str(key))}="${str_style(_.get(attrs, key))}"` || `${acc} ${_.transform_key(_.str(key))}="${_.str(_.get(attrs, key))}"`) || '';

const str_inner = (jsonml, html_arr = []) => _.reduc(jsonml, html_arr, (acc, inner) => _.is_str(inner) && [...acc, inner] || _.is_arr(inner) && build_html(inner, acc));

const open_tag = (type, attrs) => `<${_.transform_key(type)}${str_attrs(attrs)}>`;

const close_tag = type => `</${_.transform_key(type)}>`;

const wrap_tag = (first, second, ...rest) => [open_tag(first, _.is_obj(second) && second), ...str_inner([...(_.is_arr(second) && [second] || []), ...rest]), close_tag(first)];

const build_html = ([first, second, ...rest] = [], html_arr = []) => [...html_arr, ...(_.is_arr(first) && str_inner(first) || _.is_str(first) && wrap_tag(first, second, ...rest) || _.is_sym(first) && wrap_tag(_.sym_to_str(first), second, ...rest))];

const to_html = jsonml => _.join(build_html(jsonml));

const to_jsonml = ([first, ...rest] = []) => _.compress((_.is_str(first) || _.is_sym(first) || _.is_obj(first)) && [first, ...to_jsonml(rest)] || _.is_arr(first) && [to_jsonml(first), ...to_jsonml(rest)] || _.is_fn(first) && to_jsonml(first(rest)) || []);

var core = {
  str_style,
  str_attrs,
  str_inner,
  open_tag,
  close_tag,
  to_html,
  to_jsonml
};

var index = {
  consts,
  dom,
  core,
  utils: _
};

export default index;
