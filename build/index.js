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

  const sanitize = subj => repl(subj, RegExp(`[${join(uniq(split(repl(subj, /[a-z0-9-]/g, ''))))}]`, 'g'));

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

  const tags = ['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'bgsound', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command', 'content', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'image', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'listing', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'multicol', 'nav', 'nextid', 'nobr', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'plaintext', 'pre', 'progress', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'slot', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr', 'xmp'];

  const syms = _.reduc(tags, {}, (acc, tag) => _extends({}, acc, {
    [tag]: Symbol.for(tag)
  }));

  var dom = _extends({}, syms);

  const sc_tags = [syms.area, syms.base, syms.br, syms.col, syms.command, syms.embed, syms.hr, syms.img, syms.input, syms.keygen, syms.link, syms.menuitem, syms.meta, syms.param, syms.source, syms.track, syms.wbr];

  const str_style_attr = val => !_.is_str(val) && val || _.str(`${val}`);

  const str_style = attrs => {
    if (!_.is_obj(attrs)) return '';

    return _.trim(_.reduc(_.keys_of(attrs), '', (acc, key) => `${acc} ${_.transform_key(_.str(key))}: ${str_style_attr(_.get(attrs, key))};`));
  };

  const is_style = key => key === 'style';
  const is_value = key => key === 'value';
  const is_handl = key => key.match(/^on/);

  const reg_handlr = (handlrs, val) => `"redda.handlrs.get()['${handlrs.reg(val)}'](event)"`;

  const str_attrs = (attrs, handlrs) => {
    if (!_.is_obj(attrs)) return '';

    return _.reduc(_.keys_of(attrs), '', (acc, key) => {
      const trans_key = _.transform_key(_.str(key));
      const conc = `${acc} ${trans_key}=`;

      const val = _.get(attrs, key);

      if (is_style(trans_key)) return conc + `"${str_style(val)}"`;

      if (is_handl(trans_key)) return conc + reg_handlr(handlrs, val);

      if (_.is_null(val)) return acc;

      return conc + `"${_.is_str(val) ? val : _.str(val)}"`;
    });
  };

  const str_inner = (jsonml, html_arr = [], handlrs) => _.reduc(jsonml, html_arr, (acc, inner) => {
    if (_.is_str(inner)) return [...acc, inner];
    if (_.is_arr(inner)) return build_html(inner, acc, handlrs);

    return acc;
  });

  const is_sc = tag => sc_tags.includes(_.sym(tag));

  const open_tag = (type, attrs, handlrs) => `<${_.transform_key(type)}${str_attrs(attrs, handlrs)}${is_sc(type) ? ' /' : ''}>`;

  const close_tag = type => !is_sc(type) ? `</${_.transform_key(type)}>` : '';

  const wrap_tag = (handlrs, first, second, ...rest) => {
    const inner = !_.is_obj(second) && [second] || [];
    return [open_tag(first, _.is_obj(second) && second, handlrs), ...str_inner([...inner, ...rest], [], handlrs), close_tag(first)];
  };

  const build_html = ([first, second, ...rest] = [], html = [], handlrs, nodes) => {
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

  const update_build_html = (jsonml = [], node, handlrs) => {
    let [first, second, ...rest] = jsonml;

    if (node.childNodes.length && _.is_arr(first)) {
      return update_nodes(jsonml, node.childNodes, handlrs);
    }

    node.innerHTML = to_html(jsonml, handlrs, node);
  };

  const update_text_node = (text, node) => node.data !== text && (node.data = text);

  const update_node = (elem, node, handlrs) => {
    if (!elem || !node) return;

    const [first, second, ...rest] = elem;

    if (is_text(node)) {
      update_text_node(elem, node);
      return;
    }

    if (_.is_obj(second)) {
      const attrs = node.attributes;
      const elem_keys = _.keys_of(second);

      _.reduc(_.keys_of(attrs), null, (__, index) => {
        const attr = attrs[index].name;

        if (!attr || _.is_def(second[attr])) return;

        node.removeAttribute(attr);
      });

      _.reduc(elem_keys, null, (__, key) => {
        const val = second[key];

        if (is_style(key)) {
          if (!val) {
            node.removeAttribute(key);
            return;
          }

          const style_str = str_style(val);
          val && style_str != node[key] && (node[key] = style_str);
          return;
        }

        if (is_handl(key)) {
          node.removeAttribute(key);
          node[key] = val;
          return;
        }

        if (is_value(key)) {
          val !== node.value && (node.removeAttribute(key), node.value = val);

          return;
        }

        if (val) node.setAttribute(key, val);else node.removeAttribute(key);
      });

      const child_nodes = node.childNodes;

      if (!_.is_empty(rest) && _.is_empty(child_nodes)) {
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
      update_nodes([elem, ...rest_elems], rest_nodes, handlrs);
      return;
    }

    if (!_.is_empty(rest_elems) && _.is_empty(rest_nodes) && node) {
      to_nodes(rest_elems, handlrs).forEach(new_node => node.parentNode.appendChild(new_node));
    }

    if (_.is_empty(rest_elems) && !_.is_empty(rest_nodes)) {
      rest_nodes.forEach(node => node.parentNode.removeChild(node));
      return;
    }

    update_node(elem, node, handlrs);

    if (_.is_empty(rest_elems)) return;

    update_nodes(rest_elems, rest_nodes, handlrs);
  };

  const is_text = node => node && node.nodeName === '#text';

  const is_match = (elem, node) => {
    if (!node || !elem) return false;

    if (_.is_str(elem) && is_text(node)) return true;

    const [first_, second, ...rest] = elem;
    const first = _.is_sym(first_) ? _.sym_to_str(first_) : first_;

    return first == node.localName;
  };

  const render_ = handlrs => (node, app) => {
    //  const shadow = node.attachShadow({ mode: 'open' })
    const render = () => (handlrs.reset(), update_build_html([to_jsonml(app)], node, handlrs));

    render();

    return render;
  };

  const reducs_sym = _.sym(':reducs');
  const on_change_sym = _.sym(':on_change');
  const _init_state = { [reducs_sym]: {}, [on_change_sym]: [] };

  const frag = (init_state, ...reducs) => {
    const reducr_map = _.reduc(reducs, {}, (acc, reducr) => _extends({}, acc, {
      [_.sym(reducr)]: reducr
    }));

    return (state = init_state, reducr, ...args) => {
      const fn = reducr_map[_.sym(reducr)];

      if (!_.is_fn(reducr) && _.is_def(state) || !_.is_fn(fn)) return state;

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
      reset: () => store_ = {},
      reg: handlr => {
        const [handlr_id, new_store] = reg(store_, handlr);
        store_ = new_store;

        return handlr_id;
      }
    };
  };

  const handlrs$1 = handlrs();
  const render = render_(handlrs$1);

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
