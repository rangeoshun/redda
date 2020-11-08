(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.redda = factory());
}(this, (function () { 'use strict';

  const undef = undefined;

  var consts = {
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

  const sanitize = subj => repl(subj, RegExp(`[${join(uniq(split(repl(subj, /[a-z0-9-]/g, ''))))}]`, 'g'));

  const to_dashed = subj => repl(subj, '_', '-');

  const transform_key = subj => flow(to_lower, to_dashed, sanitize)(subj);

  const add_to = (arr, subj) => [...arr, subj];

  const keys_of = subj => Object.keys(subj);

  const vals_of = subj => Object.values(subj);

  const syms_of = subj => Object.getOwnPropertySymbols(subj);

  const get = (subj = {}, key) => subj[key];

  const is_empty = subj => is_null(subj) || !is_def(subj) || is_arr(subj) && !has_len(subj) || is_obj(subj) && !has_len(keys_of(subj));

  const compress = (subj = []) => reduc(subj, [], (acc, item) => is_def(item) && !is_null(item) && !is_empty(item) && [...acc, item] || acc);

  const rnd_id = () => {
    const rnd = Math.random();

    return (rnd * rnd + rnd).toString(16).replace('.', '');
  };

  var utils = {
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
    vals_of,
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

  const tags = ['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'bgsound', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command', 'content', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'image', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'listing', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'multicol', 'nav', 'nextid', 'nobr', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'plaintext', 'pre', 'progress', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'slot', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr', 'xmp'];

  const syms = utils.reduc(tags, {}, (acc, tag) => _extends({}, acc, {
    [tag]: Symbol.for(tag)
  }));

  var dom = _extends({}, syms);

  const sc_tags = [syms.area, syms.base, syms.br, syms.col, syms.command, syms.embed, syms.hr, syms.img, syms.input, syms.keygen, syms.link, syms.menuitem, syms.meta, syms.param, syms.source, syms.track, syms.wbr];

  const str_style_attr = val => !utils.is_str(val) && val || utils.str(`${val}`);

  const str_style = attrs => {
    if (!utils.is_obj(attrs)) return '';

    return utils.trim(utils.reduc(utils.keys_of(attrs), '', (acc, key) => `${acc} ${utils.transform_key(utils.str(key))}: ${str_style_attr(utils.get(attrs, key))};`));
  };

  const is_style = key => key === 'style';
  const is_value = key => key === 'value';
  const is_handl = key => key.match(/^on/);

  const str_attrs = (attrs, handlrs) => {
    if (!utils.is_obj(attrs)) return '';

    return utils.reduc(utils.keys_of(attrs), '', (acc, key) => {
      const trans_key_ = utils.transform_key(utils.str(key));
      const trans_key = is_handl(trans_key_) ? handlrs.key(trans_key_) : trans_key_;
      const conc = `${acc} ${trans_key}=`;

      const val = utils.get(attrs, key);

      if (is_style(trans_key)) return conc + `"${str_style(val)}"`;

      if (is_handl(trans_key)) return conc + `"${handlrs.reg(trans_key_, val)}"`;

      if (utils.is_null(val)) return acc;

      return conc + `"${utils.is_str(val) ? val : utils.str(val)}"`;
    });
  };

  const str_inner = (jsonml, html_arr = [], handlrs) => utils.reduc(jsonml, html_arr, (acc, inner) => {
    if (utils.is_str(inner)) return [...acc, inner];
    if (utils.is_arr(inner)) return build_html(inner, acc, handlrs);

    return acc;
  });

  const is_sc = tag => sc_tags.includes(utils.sym(tag));

  const open_tag = (type, attrs, handlrs) => `<${utils.transform_key(type)}${str_attrs(attrs, handlrs)}${is_sc(type) ? ' /' : ''}>`;

  const close_tag = type => !is_sc(type) ? `</${utils.transform_key(type)}>` : '';

  const wrap_tag = (handlrs, first, second, ...rest) => {
    const inner = !utils.is_obj(second) && [second] || [];
    return [open_tag(first, utils.is_obj(second) && second, handlrs), ...str_inner([...inner, ...rest], [], handlrs), close_tag(first)];
  };

  const build_html = ([first, second, ...rest] = [], html = [], handlrs, nodes) => {
    if (utils.is_arr(first)) return [...html, ...str_inner([first, second, ...rest], [], handlrs)];

    if (utils.is_str(first)) return [...html, ...wrap_tag(handlrs, first, second, ...rest)];

    if (utils.is_sym(first)) return [...html, ...wrap_tag(handlrs, utils.sym_to_str(first), second, ...rest)];

    return html;
  };

  const to_html = (jsonml, handlrs) => utils.join(build_html(jsonml, [], handlrs));

  const to_jsonml = ([first, ...rest] = []) => {
    if (utils.is_str(first) || utils.is_sym(first) || utils.is_obj(first)) return utils.compress([first, ...to_jsonml(rest)]);

    if (utils.is_arr(first)) return utils.compress([to_jsonml(first), ...to_jsonml(rest)]);
    if (utils.is_fn(first)) return utils.compress(to_jsonml(elem(first)(...rest)));

    return [];
  };

  const elem = fn => (attrs, ...cont) => {
    if (utils.is_obj(attrs)) return fn(attrs, ...cont);

    return fn({}, attrs, ...cont);
  };

  const update_build_html = (jsonml = [], node, handlrs) => {
    let [first, second, ...rest] = jsonml;

    if (node.childNodes.length && utils.is_arr(first)) {
      update_nodes(jsonml, node.childNodes, handlrs);
      return;
    }

    node.innerHTML = to_html(jsonml, handlrs);
  };

  const update_text_node = (text, node) => node.data !== text && (node.data = text);

  const update_node = (elem, node, handlrs) => {
    if (!elem || !node) return;

    const [first, second, ...rest] = elem;

    if (is_text(node)) {
      update_text_node(elem, node);
      return;
    }

    if (utils.is_obj(second)) {
      const attrs = node.attributes;
      const elem_keys = utils.keys_of(second);

      attrs && utils.vals_of(attrs).forEach(attr => {
        if (!attr || utils.is_def(second[attr])) return;

        node[attr] = null;
        node.removeAttribute(attr);
      });

      elem_keys.forEach(key => {
        const val = second[key];

        if (is_style(key)) {
          if (!val) {
            node.removeAttribute(key);
            return;
          }

          utils.keys_of(val).forEach(key => node.style[key] = val[key]);
          return;
        }

        if (is_handl(key)) {
          node.setAttribute(handlrs.key(key), handlrs.reg(key, val));
          return;
        }

        if (is_value(key)) {
          val !== node.value && (node.removeAttribute(key), node.value = val);
          return;
        }

        if (utils.is_def(val)) node.setAttribute(key, val), node[key] = val;else node.removeAttribute(key);
      });

      const child_nodes = node.childNodes;

      if (!utils.is_empty(rest) && utils.is_empty(child_nodes)) {
        update_build_html(rest, node, handlrs);
        return;
      }

      update_nodes(rest, child_nodes, handlrs);
      return;
    }

    if (!second) return;

    update_nodes([second, ...rest], node.childNodes, handlrs);
  };

  const buffer_node = document.createElement('div');

  const to_nodes = (jsonml, handlrs) => {
    buffer_node.innerHTML = to_html(jsonml, handlrs);

    return buffer_node.childNodes;
  };

  const update_nodes = ([elem, ...rest_elems], [node, ...rest_nodes], handlrs) => {
    if (node && !is_match(elem, node)) {
      node.parentNode.removeChild(node);
      update_node([elem, ...rest_elems], rest_nodes, handlrs);
      return;
    }

    if (!utils.is_empty(rest_elems) && utils.is_empty(rest_nodes) && node) {
      to_nodes(rest_elems, handlrs).forEach(new_node => node.parentNode.appendChild(new_node));
    }

    update_node(elem, node, handlrs);

    if (utils.is_empty(rest_elems) && !utils.is_empty(rest_nodes)) {
      rest_nodes.forEach(node => node.parentNode.removeChild(node));
    }

    if (utils.is_empty(rest_elems)) return;

    update_nodes(rest_elems, rest_nodes, handlrs);
  };

  // TODO: Is this even correct?
  // const is_coll_match = (jsonml, nodes) => {
  //   if (jsonml.length !== nodes.length) return false

  //   return _.reduc(jsonml, true, (verd, elem, index) => {
  //     if (!verd) return verd

  //     return is_match(elem, nodes[index])
  //   })
  // }

  const is_text = node => node && node.nodeName === '#text';

  const is_match = (elem, node) => {
    if (!node || !elem) return false;

    if (utils.is_str(elem) && is_text(node)) return true;

    const [first_, second, ...rest] = elem;
    const first = utils.is_sym(first_) ? utils.sym_to_str(first_) : first_;

    return first === node.localName;
  };

  const render_ = handlrs => (node, app) => {
    //  const shadow = node.attachShadow({ mode: 'open' })
    const render = () => (handlrs.detach(), handlrs.reset(), update_build_html([to_jsonml(app)], node, handlrs), handlrs.attach());

    render();

    return render;
  };

  const reducs_sym = utils.sym(':reducs');
  const on_change_sym = utils.sym(':on_change');
  const _init_state = { [reducs_sym]: {}, [on_change_sym]: [] };

  const frag = (init_state, ...reducs) => {
    const reducr_map = utils.reduc(reducs, {}, (acc, reducr) => _extends({}, acc, {
      [utils.sym(reducr)]: reducr
    }));

    return (state = init_state, reducr, ...args) => {
      const fn = reducr_map[utils.sym(reducr)];

      if (!utils.is_fn(reducr) && utils.is_def(state) || !utils.is_fn(fn)) return state;

      return reducr_map[utils.sym(reducr)](state, ...args);
    };
  };

  const add$1 = (state = _init_state, init_frag, ...reducers) => {
    const sym = utils.sym(init_frag);
    const reducr = frag(init_frag(), ...reducers);

    return _extends({}, state, {
      [sym]: reducr(),
      [reducs_sym]: _extends({}, state[reducs_sym], { [sym]: reducr })
    });
  };

  const conn = (state, elem = utils.noop, ...frags) => (...args) => elem.apply(null, [utils.reduc(frags, {}, (frag_state, { name }) => _extends({}, frag_state, {
    [name]: state()[utils.sym(name)]
  })), args]);

  const disp = (state, reducr, ...args) => {
    const reducs = state[reducs_sym];

    return utils.reduc(utils.syms_of(reducs), state, (acc, frag_name) => _extends({}, acc, {
      [frag_name]: reducs[frag_name](state[frag_name], reducr, ...args)
    }));
  };

  const call_on_change = cbs => () => utils.reduc(cbs, null, (_, cb) => cb());

  const get_state = state => utils.reduc(utils.syms_of(state), {}, (acc, key) => {
    if (key == reducs_sym || key == on_change_sym) return acc;

    return _extends({}, acc, {
      [utils.sym_to_str(key)]: state[key]
    });
  });

  const state = state_ => {
    state_ = _extends({}, state_, _init_state);

    const get = () => _extends({}, state_);
    const set = new_state => (state_ = new_state, consts);

    return {
      add: (init_frag, ...reducrs) => set(add$1(get(), init_frag, ...reducrs)),
      conn: (elem, ...frags) => conn(get, elem, ...frags),
      disp: (reducr, ...args) => (set(disp(get(), reducr, ...args)), setTimeout(call_on_change(get()[on_change_sym]))),
      on_change: fn => set(_extends({}, get(), { [on_change_sym]: [...get()[on_change_sym], fn] })),

      get: () => get_state(get())
    };
  };

  const reg = (store, handlr, handlr_key) => {
    const handlr_id = rnd_id();

    const new_store = _extends({}, store, {
      [handlr_key + '-' + handlr_id]: handlr
    });
    return [handlr_id, new_store];
  };

  const key = val => val + '-key';

  const detach = (event, handlr_id, handlr) => {
    const node = document.querySelector(`[${key(event)}="${handlr_id}"]`);
    const ev_name = repl(event, /^on/, '');

    return node.removeEventListener(ev_name, handlr);
  };

  const attach = (event, handlr_id, handlr) => {
    const node = document.querySelector(`[${key(event)}="${handlr_id}"]`);
    const ev_name = repl(event, /^on/, '');

    return node.addEventListener(ev_name, handlr);
  };

  const handlrs = store_ => {
    store_ = {};

    return {
      get: () => store_,
      reset: () => store_ = {},
      key: val => key(val),
      detach: () => reduc(keys_of(store_), null, (_, key) => {
        const [handlr_key, handlr_id] = split(key, '-');
        const handlr = store_[key];

        detach(handlr_key, handlr_id, handlr);
      }),
      attach: () => reduc(keys_of(store_), null, (_, key) => {
        const [handlr_key, handlr_id] = split(key, '-');
        const handlr = store_[key];

        attach(handlr_key, handlr_id, handlr);
      }),
      reg: (event, handlr) => {
        const [handlr_id, new_store] = reg(store_, handlr, event);
        store_ = new_store;

        return handlr_id;
      }
    };
  };

  const handlrs$1 = handlrs();
  const render = render_(handlrs$1);

  var index = {
    consts,
    dom,
    render,
    handlrs: handlrs$1,
    utils,
    state
  };

  return index;

})));
//# sourceMappingURL=index.js.map
