var redda = (function () {
  'use strict';

  const undef = undefined;

  var undef$1 = {
    undef
  };

  const noop = () => undef;
  const pass = _ => _;

  const is_null = subj => subj === null;

  const is_def = subj => subj !== undef;

  const is_str = subj => typeof subj == 'string';

  const is_fn = subj => typeof subj == 'function';

  const is_arr = subj => subj instanceof Array;

  const is_obj = subj => !is_str(subj) && !is_arr(subj) && !is_fn(subj) && subj instanceof Object;

  const is_sym = subj => typeof subj == 'symbol';

  const trim = (subj = '') => subj.trim && subj.trim();

  const add = (a, b) => a + b;

  const str = subj => (is_str(subj) || !is_def(subj)) && add(subj, '') || JSON.stringify(subj);

  const repl = (subj, char, with_char = '') => subj.replace(char, with_char);

  const sym = subj => is_fn(subj) ? sym(subj.name) : Symbol.for(subj);

  const sym_to_str = sym => Symbol.keyFor(sym);

  const has_len = arr => !!arr.length;

  const is_in = (subj, arr = []) => reduc(arr, false, (acc, item) => acc || item == subj);

  const join = (subj = [], joiner = '') => is_fn(subj.join) && subj.join(joiner);

  const uniq = subj => reduc(subj, [], (acc, item) => is_in(item, acc) ? acc : [...acc, item]);

  const split = (subj = {}, by = '') => is_fn(subj.split) && subj.split(by);

  const reduc = ([first, ...rest] = [], acc = undef, fn = noop, index_ = 0) => is_def(first) || has_len(rest) ? reduc(rest, fn(acc, first, index_), fn) : acc;

  const flow = (...fns) => subj => reduc(fns, subj, (acc, fn) => fn(acc));

  const to_lower = subj => str(subj).toLowerCase();

  const sanitize = subj => repl(subj, RegExp(`[${join(uniq(split(repl(subj, /[a-z-]/g, ''))))}]`, 'g'));

  const to_dashed = subj => repl(subj, '_', '-');

  const transform_key = subj => flow(to_lower, to_dashed, sanitize)(subj);

  const add_to = (arr, subj) => [...arr, subj];

  const keys_of = subj => Object.keys(subj);

  const syms_of = subj => Object.getOwnPropertySymbols(subj);

  const get = (subj = {}, key) => subj[key];

  const is_empty = subj => is_null(subj) || !is_def(subj) || is_arr(subj) && !has_len(subj) || is_obj(subj) && !has_len(keys_of(subj));

  const compress = (subj = []) => reduc(subj, [], (acc, item) => is_def(item) && !is_null(item) && !is_empty(item) && [...acc, item] || acc);

  const rnd_id = () => {
    const rnd = Math.random();

    return (rnd * rnd + rnd).toString(16).replace('.', '');
  };

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
    syms_of,
    get,
    repl,
    trim,
    compress,
    is_empty,
    rnd_id,
    pass
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

  var dom = _extends({}, syms);

  const str_style_attr = val => !_.is_str(val) && val || _.str(`${val}`);

  const str_style = attrs => {
    if (!_.is_obj(attrs)) return '';

    return _.trim(_.reduc(_.keys_of(attrs), '', (acc, key) => `${acc} ${_.transform_key(_.str(key))}: ${str_style_attr(_.get(attrs, key))};`));
  };

  const is_style = key => key === 'style';
  const is_handl = key => key.match(/^on/);

  const str_attrs = (attrs, handlrs) => {
    if (!_.is_obj(attrs)) return '';

    return _.reduc(_.keys_of(attrs), '', (acc, key) => {
      const trans_key = _.transform_key(_.str(key));
      const conc = `${acc} ${trans_key}=`;
      const val = _.get(attrs, key);

      if (is_style(trans_key)) return conc + `"${str_style(val)}"`;

      if (is_handl(trans_key)) {
        const handlr_id = handlrs.reg(val);
        return conc + `"redda.handlrs.get()['${handlr_id}'](event)"`;
      }

      return conc + `"${_.str(val)}"`;
    });
  };

  const str_inner = (jsonml, html_arr = [], handlrs) => _.reduc(jsonml, html_arr, (acc, inner) => {
    if (_.is_str(inner)) return [...acc, inner];
    if (_.is_arr(inner)) return build_html(inner, acc, handlrs);

    return acc;
  });

  const open_tag = (type, attrs, handlrs) => `<${_.transform_key(type)}${str_attrs(attrs, handlrs)}>`;

  const close_tag = type => `</${_.transform_key(type)}>`;

  const wrap_tag = (handlrs, first, second, ...rest) => {
    const inner = !_.is_obj(second) && [second] || [];

    return [open_tag(first, _.is_obj(second) && second, handlrs), ...str_inner([...inner, ...rest], [], handlrs), close_tag(first)];
  };

  const build_html = ([first, second, ...rest] = [], html = [], handlrs) => {
    if (_.is_arr(first)) return [...html, ...str_inner([first, second, ...rest], [], handlrs)];

    if (_.is_str(first)) return [...html, ...wrap_tag(handlrs, first, second, ...rest)];

    if (_.is_sym(first)) return [...html, ...wrap_tag(handlrs, _.sym_to_str(first), second, ...rest)];

    return html;
  };

  const to_html = (jsonml, handlrs) => _.join(build_html(jsonml, [], handlrs));

  const to_jsonml = ([first, ...rest] = []) => {
    if (_.is_str(first) || _.is_sym(first) || _.is_obj(first)) return _.compress([first, ...to_jsonml(rest)]);

    if (_.is_arr(first)) return _.compress([to_jsonml(first), ...to_jsonml(rest)]);
    if (_.is_fn(first)) return _.compress(to_jsonml(elem(first)(...rest)));

    return [];
  };

  const elem = fn => (attrs, ...cont) => {
    if (_.is_obj(attrs)) return fn(attrs, ...cont);

    return fn({}, attrs, ...cont);
  };

  var renderer = (handlrs => (node, app) => {
    console.log(handlrs);
    const render = () => node.innerHTML = to_html(to_jsonml(app), handlrs);

    handlrs.reset();
    render();

    return render;
  });

  const reducs_sym = _.sym(':reducs');
  const on_change_sym = _.sym(':on_change');
  const _init_state = { [reducs_sym]: {}, [on_change_sym]: [] };

  const frag = (init_state, ...reducs) => {
    const reducr_map = _.reduc(reducs, {}, (acc, reducr) => _extends({}, acc, {
      [_.sym(reducr)]: reducr
    }));

    return (state = init_state, reducr, ...args) => {
      if (!_.is_fn(reducr) && _.is_def(state)) return state;

      return reducr_map[_.sym(reducr)](state, ...args);
    };
  };

  const add$1 = (state = _init_state, init_frag, ...reducers) => {
    const sym$$1 = _.sym(init_frag);
    const reducr = frag(init_frag(), ...reducers);

    return _extends({}, state, {
      [sym$$1]: reducr(),
      [reducs_sym]: _extends({}, state[reducs_sym], { [sym$$1]: reducr })
    });
  };

  const conn = (state, elem = _.noop, ...frags) => (...args) => elem.apply(null, [_.reduc(frags, {}, (frag_state, { name }) => _extends({}, frag_state, {
    [name]: state()[_.sym(name)]
  })), args]);

  const disp = (state, reducr, ...args) => {
    const reducs = state[reducs_sym];

    return _.reduc(_.syms_of(reducs), state, (acc, frag_name) => _extends({}, acc, {
      [frag_name]: reducs[frag_name](state[frag_name], reducr, ...args)
    }));
  };

  const call_on_change = cbs => _.reduc(cbs, null, (_$$1, cb) => cb());

  const get_state = state => _.reduc(_.syms_of(state), {}, (acc, key) => {
    if (key == reducs_sym || key == on_change_sym) return acc;

    return _extends({}, acc, {
      [_.sym_to_str(key)]: state[key]
    });
  });

  const state = state_ => {
    state_ = _extends({}, state_, _init_state);

    const get$$1 = () => _extends({}, state_);
    const set$$1 = new_state => (state_ = new_state, undef$1);

    return {
      add: (init_frag, ...reducrs) => set$$1(add$1(get$$1(), init_frag, ...reducrs)),
      conn: (elem, ...frags) => conn(get$$1, elem, ...frags),
      disp: (reducr, ...args) => (set$$1(disp(get$$1(), reducr, ...args)), call_on_change(get$$1()[on_change_sym])),
      on_change: fn => set$$1(_extends({}, get$$1(), { [on_change_sym]: [...get$$1()[on_change_sym], fn] })),

      get: () => get_state(get$$1())
    };
  };

  const reg = (store, handlr) => {
    const handlr_id = rnd_id();

    const new_store = _extends({}, store, {
      [handlr_id]: handlr
    });
    return [handlr_id, new_store];
  };

  const handlrs = store_ => {
    store_ = {};

    return {
      get: () => store_,
      reset: () => reduc(keys_of(store_), (_$$1, key) => delete store_[key]),
      reg: handlr => {
        const [handlr_id, new_store] = reg(store_, handlr);
        store_ = new_store;

        return handlr_id;
      }
    };
  };

  const handlrs$1 = handlrs();
  const render = renderer(handlrs$1);

  var index = {
    consts: undef$1,
    dom,
    render,
    handlrs: handlrs$1,
    utils: _,
    state
  };

  return index;

}());
//# sourceMappingURL=index.js.map
