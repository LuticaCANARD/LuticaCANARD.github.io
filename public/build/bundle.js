
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
'use strict';

function noop() { }
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
    if (!src_url_equal_anchor) {
        src_url_equal_anchor = document.createElement('a');
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function null_to_empty(value) {
    return value == null ? '' : value;
}
function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
// unfortunately this can't be a constant as that wouldn't be tree-shakeable
// so we cache the result instead
let crossorigin;
function is_crossorigin() {
    if (crossorigin === undefined) {
        crossorigin = false;
        try {
            if (typeof window !== 'undefined' && window.parent) {
                void window.parent.document;
            }
        }
        catch (error) {
            crossorigin = true;
        }
    }
    return crossorigin;
}
function add_resize_listener(node, fn) {
    const computed_style = getComputedStyle(node);
    if (computed_style.position === 'static') {
        node.style.position = 'relative';
    }
    const iframe = element('iframe');
    iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
        'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    const crossorigin = is_crossorigin();
    let unsubscribe;
    if (crossorigin) {
        iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
        unsubscribe = listen(window, 'message', (event) => {
            if (event.source === iframe.contentWindow)
                fn();
        });
    }
    else {
        iframe.src = 'about:blank';
        iframe.onload = () => {
            unsubscribe = listen(iframe.contentWindow, 'resize', fn);
        };
    }
    append(node, iframe);
    return () => {
        if (crossorigin) {
            unsubscribe();
        }
        else if (unsubscribe && iframe.contentWindow) {
            unsubscribe();
        }
        detach(iframe);
    };
}
function custom_event(type, detail, bubbles = false) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, false, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();
let flushidx = 0; // Do *not* move this inside the flush() function
function flush() {
    const saved_component = current_component;
    do {
        // first, call beforeUpdate functions
        // and update components
        while (flushidx < dirty_components.length) {
            const component = dirty_components[flushidx];
            flushidx++;
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        flushidx = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);

function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
        old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    i = n;
    while (i--) {
        const child_ctx = get_context(ctx, list, i);
        const key = get_key(child_ctx);
        let block = lookup.get(key);
        if (!block) {
            block = create_each_block(key, child_ctx);
            block.c();
        }
        else if (dynamic) {
            block.p(child_ctx, dirty);
        }
        new_lookup.set(key, new_blocks[i] = block);
        if (key in old_indexes)
            deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
        transition_in(block, 1);
        block.m(node, next);
        lookup.set(block.key, block);
        next = block.first;
        n--;
    }
    while (o && n) {
        const new_block = new_blocks[n - 1];
        const old_block = old_blocks[o - 1];
        const new_key = new_block.key;
        const old_key = old_block.key;
        if (new_block === old_block) {
            // do nothing
            next = new_block.first;
            o--;
            n--;
        }
        else if (!new_lookup.has(old_key)) {
            // remove old block
            destroy(old_block, lookup);
            o--;
        }
        else if (!lookup.has(new_key) || will_move.has(new_key)) {
            insert(new_block);
        }
        else if (did_move.has(old_key)) {
            o--;
        }
        else if (deltas.get(new_key) > deltas.get(old_key)) {
            did_move.add(new_key);
            insert(new_block);
        }
        else {
            will_move.add(old_key);
            o--;
        }
    }
    while (o--) {
        const old_block = old_blocks[o];
        if (!new_lookup.has(old_block.key))
            destroy(old_block, lookup);
    }
    while (n)
        insert(new_blocks[n - 1]);
    return new_blocks;
}
function validate_each_keys(ctx, list, get_context, get_key) {
    const keys = new Set();
    for (let i = 0; i < list.length; i++) {
        const key = get_key(get_context(ctx, list, i));
        if (keys.has(key)) {
            throw new Error('Cannot have duplicate keys in a keyed each');
        }
        keys.add(key);
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
}
function append_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev('SvelteDOMRemove', { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
    else
        dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 */
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error("'target' is a required option");
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn('Component was already destroyed'); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
}

/* src\post_list\depressContest.svelte generated by Svelte v3.46.4 */

const file$5 = "src\\post_list\\depressContest.svelte";

function create_fragment$5(ctx) {
	let head;
	let t0;
	let body;
	let hr0;
	let t1;
	let center0;
	let h30;
	let t3;
	let p10;
	let t4;
	let br0;
	let t5;
	let t6;
	let hr1;
	let t7;
	let center1;
	let h31;
	let t9;
	let p11;
	let t10;
	let br1;
	let t11;
	let t12;
	let hr2;
	let t13;
	let center2;
	let h32;
	let t15;
	let p12;
	let t16;
	let br2;
	let t17;
	let br3;
	let t18;
	let br4;
	let t19;
	let br5;
	let t20;
	let br6;
	let t21;
	let br7;
	let t22;
	let br8;
	let t23;
	let br9;
	let t24;
	let h5;
	let p13;
	let t26;
	let br10;
	let t27;
	let br11;
	let t28;
	let br12;
	let t29;
	let br13;
	let t30;
	let br14;
	let t31;
	let t32;
	let hr3;
	let t33;
	let center3;
	let h33;
	let t35;
	let p14;
	let t36;
	let br15;
	let t37;
	let br16;
	let t38;
	let br17;
	let t39;
	let br18;
	let t40;
	let br19;
	let t41;
	let br20;
	let t42;
	let br21;
	let t43;
	let t44;
	let hr4;
	let t45;
	let center4;
	let h34;
	let t47;
	let p15;
	let t48;
	let br22;
	let t49;
	let br23;
	let t50;
	let br24;
	let t51;
	let br25;
	let t52;
	let t53;
	let hr5;
	let t54;
	let center5;
	let h35;
	let t56;
	let p16;
	let t57;
	let br26;
	let t58;
	let br27;
	let t59;
	let br28;
	let t60;
	let br29;
	let t61;
	let br30;
	let t62;
	let br31;
	let t63;
	let br32;
	let t64;
	let hr6;
	let t65;
	let center6;
	let h36;
	let t67;
	let p17;
	let t68;
	let br33;
	let t69;
	let br34;
	let t70;
	let br35;
	let t71;
	let hr7;
	let t72;
	let center7;
	let h37;
	let t74;
	let p18;
	let t75;
	let br36;
	let t76;
	let br37;
	let t77;
	let br38;
	let t78;
	let br39;
	let t79;
	let br40;
	let t80;
	let t81;
	let hr8;
	let t82;
	let center8;
	let h38;
	let t84;
	let p19;
	let t85;
	let br41;
	let t86;
	let br42;
	let t87;
	let br43;
	let t88;
	let br44;
	let br45;
	let t89;
	let br46;
	let t90;
	let br47;
	let t91;
	let center9;
	let iframe;
	let iframe_src_value;
	let body_class_value;

	const block = {
		c: function create() {
			head = element("head");
			t0 = space();
			body = element("body");
			hr0 = element("hr");
			t1 = space();
			center0 = element("center");
			h30 = element("h3");
			h30.textContent = "04 04 08:00";
			t3 = space();
			p10 = element("p1");
			t4 = text("오늘도 마작을 쳐봤다. 쳐보면서 곰곰히 생각을 해봤는데, 입원 전에 전철에서 울던 이유를 깊게 생각해보니 \"삶의 중간이다\"라는 생각이 단 한번도 없어서 그랬던 걸지도 모른다. ");
			br0 = element("br");
			t5 = text("\r\n퇴원을 한다면 아마도, \"지금은 아직 삶의 중간일 뿐\"이라는 질문을 던질 수 있지 않을까...");
			t6 = space();
			hr1 = element("hr");
			t7 = space();
			center1 = element("center");
			h31 = element("h3");
			h31.textContent = "04 30 21:30";
			t9 = space();
			p11 = element("p1");
			t10 = text("처음에 교수님이 바뀔때를 생각해봤다. 지금들어서 보니 그때 무슨말을 했는지도 기억이 안난다. 뭔가 과거의 다른 나였을지도 모른다. 이제는 과거를 조금 놔줄때일까. ");
			br1 = element("br");
			t11 = text("\r\n지금에 영향을 미친 과거는 어쩌고");
			t12 = space();
			hr2 = element("hr");
			t13 = space();
			center2 = element("center");
			h32 = element("h3");
			h32.textContent = "04 03 20:00";
			t15 = space();
			p12 = element("p1");
			t16 = text("가끔은 우울하다. 물속의 고요함을 다시 생각해봤다. 인생은 스펙트럼인걸 알고는 있지만, 문제는 이게 생각대로 믿어지질 않는다.");
			br2 = element("br");
			t17 = text("\r\n물속의 고요함과 평온함. 그리고 고래. 언젠가 고래 한마리가 물속에 있는 그림을 생각했었다. 아쿠아리움에 갔던 기억을 살려, 무언가 고요하고 거대한 그림이 떠오른다.");
			br3 = element("br");
			t18 = text("\r\n그림. 나는 그림그리는걸 좋아했었다. 지금도 좋아하지만, 약간 멀리하게 된 감이 없잖아 있다. 하지만 그림은, 말로는 표현못할 거대한 임팩트응 가지고 있다. 그런점이 나에게 있어서는 매력이었고, 그림도 배워봤다");
			br4 = element("br");
			t19 = text("\r\n그림그리기. 그림을 그릴때는 일단 뭘 먼저 그릴지 생각해봐야 한다. 그리고 나서 어떻게그릴지를 생각하는 것이다. 하지만 내 실력은 그 생각을 따라가지 못해 매일 끙끙대곤 했다.");
			br5 = element("br");
			t20 = text("\r\n나는 삶의 고통이 컸다. 나는 마음의 피로 그 뒤에 있는 캔버스를 채웠다. 분명 밝은 빛은 아닐것이다. 나는 어둡고 파란색을 좋아한다. 하지만 피는 붉다. 어 이게 아닌데.");
			br6 = element("br");
			t21 = text("\r\n내 마음은 그렇게 죽어만 갔다. 저번의 환각은 그 거의 죽어가던 마음의 마지막 몸부림이 아닐까 생각도 해봤다.");
			br7 = element("br");
			t22 = text("\r\n고통은 삶의 환희가 주는 선명함보다 더 어둡다. 내 뒤에 있는 그림은 내 마음의 피로 채워졌고, 환희는 그 캔버스에 보이지 않았다. ");
			br8 = element("br");
			t23 = text("\r\n하지만, 어둠은 빛에 상대적인 개념이다. 생각해보면, 빛이 없다면 어둡다라는 개념이 있었을까? 나는 그래서 항상 이 말을 가슴에 새겨살았다.  ");
			br9 = element("br");
			t24 = space();
			h5 = element("h5");
			h5.textContent = "빛이 있기에 어둠이 있다.";
			p13 = element("p1");
			t26 = text("고.");
			br10 = element("br");
			t27 = text("\r\n하지만, 내 뒤에 캔버스를 보면 그런것 같지가 않다. 나는 왜이리 어두운가, 나는 왜 내가 생각하는 그림이 되지 못 한걸까. ");
			br11 = element("br");
			t28 = text("\r\n주변? 주변때문일 가능성이 사실은 높다고 생각하지만, 사람은 주변이 있어서 살아간다. 하지만 나는 뭔가?");
			br12 = element("br");
			t29 = text("\r\n생각해보면, 그동안의 해결방법은 \"주변\"을 없애고 그저 깊고깊은 어둠속으로 가려한걸지도 모른다.");
			br13 = element("br");
			t30 = text("\r\n다시 생각해보자. \"빛이 있기에 어둠이 있다.\" 이말은 곧 빛으로 채우면 더더욱 선명한 그림이 될지도 모른다..만, 코로나가 내 모든 염료를 빼앗아간 것 같다. ");
			br14 = element("br");
			t31 = text("\r\n모르겠다. 이제는 어떻게 채워야 하는지, 뭘로, 언제, 어디를 채울건지. 내가 답을 낼 뿐이다.");
			t32 = space();
			hr3 = element("hr");
			t33 = space();
			center3 = element("center");
			h33 = element("h3");
			h33.textContent = "04 03 16:00";
			t35 = space();
			p14 = element("p1");
			t36 = text("나른하다. 이제는 무기력하지는 않지만 다시 나갔을때 무기력해질지 두렵다. 생각을 해보니 내 과거를 용납하던 잊던 어떻게든 떨쳐야한다. ");
			br15 = element("br");
			t37 = text("\r\n그리고 알바는 생각을 해보니 주 4일해서 하루는 연구나 재택을 하는게 좋지않을까 싶다. ");
			br16 = element("br");
			t38 = text("\r\n삶에 대한 여러생각을 해봤다. 난 사회성이 그리 좋진 않구나, 사망관에 대한 사고실험 논리, 무기력함을 줄이는법, 나의 시간 갖기등. ");
			br17 = element("br");
			t39 = text("\r\n살아서 힘들다. 맞다. 그걸로 무기력해지지 않으면 될뿐. ");
			br18 = element("br");
			t40 = text("\r\n내 친구?중에 정말 마이페이스로 사는 친구가 있고, 다른 친구는 \"그냥 앞길만 생각하면 된다\"던 친구가 있었다. 그렇게 사는것도 방법일지도 모르겠다.");
			br19 = element("br");
			t41 = text("\r\n다음주에는 화요일까지 마지막 작업을 하고 나가려고 한다. 사실 내일 나가도 좋겠지만, 몇가지만 좀 더하고 가는것도 나쁘지 않을것 같다.");
			br20 = element("br");
			t42 = text("\r\n목표하던 블로그만들기는 성과가 꽤 있었다. 이 일을 진행한 덕분에 몇가지 기술에 있어서 괜찮은 진전을 보였다고 생각한다. 책으로 읽던 것도 꽤 재미있었고, 나만의 시간이 있으면 좋은 점을 찾은 것 같다.");
			br21 = element("br");
			t43 = text("\r\n여러모로 인생에 대한 기점일지도 모르겠다.");
			t44 = space();
			hr4 = element("hr");
			t45 = space();
			center4 = element("center");
			h34 = element("h3");
			h34.textContent = "04 03 09:30";
			t47 = space();
			p15 = element("p1");
			t48 = text("마작을 쳐봤다. 매번 쳤지만, 병원에서 치기는 또 오랜만인것 같다. 마작을 칠떄 보면, 지다가도 역전을 하는 떄가 있기도 하고, 내가 원하던 패가 안나오곤 한다. ");
			br22 = element("br");
			t49 = text("\r\n마작을 치다보면, 나는 결과에는 별 상관없이 몰입을 하게 된다. 이것이 내 인생을 살아가는데 있어서 무언가 필요한 것이 아니었을까. ");
			br23 = element("br");
			t50 = text("\r\n흔히들 \"몰입형 콘텐츠\"의 대표로서 VR을 뽑곤 한다. 나는 재작년부터 VR을 해왔던 사람으로서, 거기에 크게 공감한다. \"몰입\". ");
			br24 = element("br");
			t51 = text("\r\n나는 그동안 인생에 대해서 몰입을 하기 보다는 관조와 회피에 급급했을지도 모른다. 항상 관조를 해옴으로서 내 인생을 철저히 평가하고 재단해봤지만, 그 결과는 고통만이 있었을 지도 모른다.");
			br25 = element("br");
			t52 = text("\r\n요즘 들어서야 몰입에 대한 생각이 슬슬 바뀌고 있다. 과연, 내인생에 필요한 \"몰입\"은 무엇일까.");
			t53 = space();
			hr5 = element("hr");
			t54 = space();
			center5 = element("center");
			h35 = element("h3");
			h35.textContent = "04 02 14:30";
			t56 = space();
			p16 = element("p1");
			t57 = text("산책을 했다. 목련꽃이 피어있었다. 하얗고 나무같지만 꽃같기도 한 그 어중간한 느낌이 좋아서 나는 목련꽃을 좋아한다. 목련, 목련의 꽃말은 고귀함과 숭고함이라고 전해진다. 그 꽃과 아름다우면서도 투박한 그 모양에 걸맞는듯한 꽃말이 아닐까.");
			br26 = element("br");
			t58 = text("\r\n 목련이 피었고, 다음주에는 벚꽃이 핀다. 벚꽃이 만들어내는 때에는 나무위를 보면 아름다운 색채가 느껴지지만, 가장 예쁜때는 만개한 뒤 지기 시작할 때이다.");
			br27 = element("br");
			t59 = text("\r\n삶. 삶은 벚꽃놀이와 같아서 가장 암울한 때를 지나고 난 뒤 가장 성숙해진 때가 좋은것인가. 그때가 가장 아름다운 때인가.");
			br28 = element("br");
			t60 = text("\r\n내 삶. 목련과 같이 일에 어중간한 정체성을 가진 나는, 목련의 꽃말과 그 아름다움을 따를 마음을 가지고 있는가. 죽는다면, 목련꽃은 땅으로 내려가 썩을뿐이다. 삶의 마지막은 이와 같다. ");
			br29 = element("br");
			t61 = text("\r\n끝의 내 삶. 언젠가 \"최첨단에 서있겠다\"는 마음가짐은 잊혀져왔고, 오히려 심리적으로 최첨단에 서있게 되었다. 마지막을 맞는 나의 인생은, 분명 목련을 따라서, 그 끝에도 아름다움을 잊고싶지 않다.");
			br30 = element("br");
			t62 = text("\r\n처음의 내 삶. 나는 분명 처음에는 뭔가 할줄 알았다. 하지만 잊혀져왔고, 무뎌져왔고, 무기력해져왔고, 몸에는 더이상의 활력도 없었다. \"빛이 있으라\"던 빛도, 보이지 않고 어둠속에서 살아왔다. 그 터널을 나올때까지 버티면서 ");
			br31 = element("br");
			t63 = text("\r\n앞으로의 내 삶. 이제 피는 목련인지, 다 펴버린 목련인지는 알 바가 없지만, 끝은 그 꽃말을 따르길. 빛이 있길. 끝이 있길. ");
			br32 = element("br");
			t64 = space();
			hr6 = element("hr");
			t65 = space();
			center6 = element("center");
			h36 = element("h3");
			h36.textContent = "04 02 10:00";
			t67 = space();
			p17 = element("p1");
			t68 = text("휴학을 한게 약간은 후회가 되긴 한다. 하지만 생각해보면, 낮은 학점으로 나갈바에야 & 철도기술연구원 IPP도 못해볼 바에야 차라리 학교를 나가던지 쉬면서 일하고 상황이 나아지면 다시 학교로 오는게 저 낫겠지 싶다.");
			br33 = element("br");
			t69 = text("\r\n디자인 패턴공부도 이제 슬슬 방법론을 찾아서 하게되었고, 나도 뭔가 생각이 정리가 된다. ");
			br34 = element("br");
			t70 = text("\r\n42Seoul이라는 유명한 부트캠프(?)에 La pisin이라는 과정이 있는데, 한달간 확실히 한 뒤 그 뒤에 느슨해지는 방법론을 채택했다. 생각해보면 나도 그런 방법론을 향하는게 아닐까 싶다.");
			br35 = element("br");
			t71 = space();
			hr7 = element("hr");
			t72 = space();
			center7 = element("center");
			h37 = element("h3");
			h37.textContent = "04 01 21:30";
			t74 = space();
			p18 = element("p1");
			t75 = text("어느날 문득 삶에 대한 회의가 들었다. 어떤 일이었는지는 모르지만, 무슨 일이 들어서 삶을 던지고 싶었다. 삶이 뭔데 나에게 이렇게 고통스럽게 하는지 모르겠다는 생각을 한다.");
			br36 = element("br");
			t76 = text("\r\n    인생, 하나의 바다와도 같고 땅과도 같으며 우주와도 같은 미지의 세계. 삶과 바다,우주는 어찌보면 하나의 흐름일지도 모른다.");
			br37 = element("br");
			t77 = text("\r\n    삶이 바다라고 가정하면, 땅을 찾아 헤메던 나의 인생은 희망고문에 시달린걸지도 모른다. 이 방향으로 가면 땅이 나온다는 굳센 믿음으로 살아왔지만, 사실은 아무것도 없었던.");
			br38 = element("br");
			t78 = text("\r\n    요근래 코딩이라는 새로운 길을 찾았다곤 하지만 가끔은 과거의 철도기관사와 같은 희망고문이 될까 많이 두렵다.");
			br39 = element("br");
			t79 = text("\r\n    하지만 하나의 작은 섬이라도, 아마 미래에 보면 \"희망봉\"같은 섬이 될지도 모른다는 생각도 든다. 모르겠다. 아직은. 지금도 과거도 삶에 배신당한 일만 기억이 날뿐.");
			br40 = element("br");
			t80 = text("\r\n    희망이 있기를.");
			t81 = space();
			hr8 = element("hr");
			t82 = space();
			center8 = element("center");
			h38 = element("h3");
			h38.textContent = "04 01 20:00";
			t84 = space();
			p19 = element("p1");
			t85 = text("예전에 자주 듣던 음악을 들었다. 이유는 모르겠지만 힘들때마다 듣기도 하고, 고통스러울때마다, 행복할때도 들었었다.");
			br41 = element("br");
			t86 = text("\r\n그때 들었던 음악을 들으니, 과거의 내가 생각나 이유를 모을 울음을 터트렸다. 나는 내 삶을 아무도 알아 주지않던, 그리고 알아주지도 않을 세상에서 보내고 있다. 어쩔수없다.");
			br42 = element("br");
			t87 = text("\r\n나는 지금의 내가 싫고, 짜증나지만, 어떻게 살기는 할테니 미래를 개선해나가는 수 밖에 없다. 지금의 나랑 과거의 나는 다르다는점, 이것 하나는 확실해졌다.");
			br43 = element("br");
			t88 = text("\r\n과연 내가 내가 원하는 삶인지도, 왜 태어났는지도 모르지만 살겠다면 확실히 살아야지. ");
			br44 = element("br");
			br45 = element("br");
			t89 = text("\r\n여름철에 바다를 가면 덥고, 물이 가장 시원하지만, 겨울철에 바다를 가면 바람이 매우 강하고 춥다. 인생의 시련이란게 그런것인가. 삶의 고통이란 그런것인가. ");
			br46 = element("br");
			t90 = text("\r\n내가 좋아하던 음악 하나를 덧붙이고 싶다. 내가 가장 우울할때 자주 듣던 음악이었다. ");
			br47 = element("br");
			t91 = space();
			center9 = element("center");
			iframe = element("iframe");
			add_location(head, file$5, 4, 0, 64);
			add_location(hr0, file$5, 7, 0, 115);
			add_location(h30, file$5, 9, 0, 131);
			add_location(center0, file$5, 8, 0, 121);
			add_location(br0, file$5, 12, 98, 269);
			add_location(p10, file$5, 11, 0, 165);
			add_location(hr1, file$5, 15, 0, 337);
			add_location(h31, file$5, 17, 0, 353);
			add_location(center1, file$5, 16, 0, 343);
			add_location(br1, file$5, 20, 91, 488);
			add_location(p11, file$5, 19, 0, 391);
			add_location(hr2, file$5, 23, 0, 521);
			add_location(h32, file$5, 25, 0, 537);
			add_location(center2, file$5, 24, 0, 527);
			add_location(br2, file$5, 27, 74, 645);
			add_location(br3, file$5, 28, 92, 743);
			add_location(br4, file$5, 29, 117, 866);
			add_location(br5, file$5, 30, 98, 970);
			add_location(br6, file$5, 31, 96, 1072);
			add_location(br7, file$5, 32, 61, 1139);
			add_location(br8, file$5, 33, 74, 1219);
			add_location(br9, file$5, 34, 80, 1305);
			add_location(p12, file$5, 27, 0, 571);
			add_location(h5, file$5, 35, 0, 1316);
			add_location(br10, file$5, 35, 30, 1346);
			add_location(br11, file$5, 36, 70, 1422);
			add_location(br12, file$5, 37, 58, 1486);
			add_location(br13, file$5, 38, 53, 1545);
			add_location(br14, file$5, 39, 90, 1641);
			add_location(p13, file$5, 35, 24, 1340);
			add_location(hr3, file$5, 41, 0, 1708);
			add_location(h33, file$5, 43, 0, 1724);
			add_location(center3, file$5, 42, 0, 1714);
			add_location(br15, file$5, 45, 80, 1838);
			add_location(br16, file$5, 46, 49, 1893);
			add_location(br17, file$5, 47, 75, 1974);
			add_location(br18, file$5, 48, 32, 2012);
			add_location(br19, file$5, 49, 83, 2101);
			add_location(br20, file$5, 50, 75, 2182);
			add_location(br21, file$5, 51, 113, 2301);
			add_location(p14, file$5, 45, 0, 1758);
			add_location(hr4, file$5, 53, 0, 2338);
			add_location(h34, file$5, 55, 0, 2354);
			add_location(center4, file$5, 54, 0, 2344);
			add_location(br22, file$5, 57, 96, 2483);
			add_location(br23, file$5, 58, 74, 2563);
			add_location(br24, file$5, 59, 74, 2643);
			add_location(br25, file$5, 60, 104, 2753);
			add_location(p15, file$5, 57, 0, 2387);
			add_location(hr5, file$5, 62, 0, 2822);
			add_location(h35, file$5, 64, 0, 2838);
			add_location(center5, file$5, 63, 0, 2828);
			add_location(br26, file$5, 66, 137, 3010);
			add_location(br27, file$5, 67, 87, 3103);
			add_location(br28, file$5, 68, 68, 3177);
			add_location(br29, file$5, 69, 105, 3288);
			add_location(br30, file$5, 70, 110, 3404);
			add_location(br31, file$5, 71, 126, 3536);
			add_location(p16, file$5, 66, 0, 2873);
			add_location(br32, file$5, 72, 77, 3619);
			add_location(hr6, file$5, 73, 0, 3625);
			add_location(h36, file$5, 75, 0, 3641);
			add_location(center6, file$5, 74, 0, 3631);
			add_location(br33, file$5, 77, 124, 3798);
			add_location(br34, file$5, 78, 50, 3854);
			add_location(p17, file$5, 77, 0, 3674);
			add_location(br35, file$5, 79, 113, 3973);
			add_location(hr7, file$5, 80, 0, 3979);
			add_location(h37, file$5, 82, 4, 3999);
			add_location(center7, file$5, 81, 0, 3985);
			add_location(br36, file$5, 84, 102, 4134);
			add_location(br37, file$5, 85, 73, 4213);
			add_location(br38, file$5, 86, 99, 4318);
			add_location(br39, file$5, 87, 64, 4388);
			add_location(br40, file$5, 88, 96, 4490);
			add_location(p18, file$5, 84, 0, 4032);
			add_location(hr8, file$5, 90, 0, 4516);
			add_location(h38, file$5, 92, 8, 4544);
			add_location(center8, file$5, 91, 4, 4526);
			add_location(br41, file$5, 94, 68, 4650);
			add_location(br42, file$5, 95, 97, 4753);
			add_location(br43, file$5, 96, 87, 4846);
			add_location(br44, file$5, 97, 48, 4900);
			add_location(br45, file$5, 97, 52, 4904);
			add_location(br46, file$5, 98, 88, 4998);
			add_location(br47, file$5, 99, 48, 5052);
			add_location(p19, file$5, 94, 0, 4582);
			attr_dev(iframe, "width", "auto");
			attr_dev(iframe, "height", "auto");
			if (!src_url_equal(iframe.src, iframe_src_value = "https://www.youtube.com/embed/ypM_WGTlb1U")) attr_dev(iframe, "src", iframe_src_value);
			attr_dev(iframe, "title", "YouTube video player");
			attr_dev(iframe, "frameborder", "0");
			attr_dev(iframe, "allow", "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
			iframe.allowFullscreen = true;
			add_location(iframe, file$5, 101, 0, 5074);
			add_location(center9, file$5, 100, 0, 5064);
			attr_dev(body, "class", body_class_value = /*darkmode*/ ctx[0] + /*fontmode*/ ctx[1]);
			add_location(body, file$5, 6, 0, 81);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, head, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, body, anchor);
			append_dev(body, hr0);
			append_dev(body, t1);
			append_dev(body, center0);
			append_dev(center0, h30);
			append_dev(body, t3);
			append_dev(body, p10);
			append_dev(p10, t4);
			append_dev(p10, br0);
			append_dev(p10, t5);
			append_dev(body, t6);
			append_dev(body, hr1);
			append_dev(body, t7);
			append_dev(body, center1);
			append_dev(center1, h31);
			append_dev(body, t9);
			append_dev(body, p11);
			append_dev(p11, t10);
			append_dev(p11, br1);
			append_dev(p11, t11);
			append_dev(body, t12);
			append_dev(body, hr2);
			append_dev(body, t13);
			append_dev(body, center2);
			append_dev(center2, h32);
			append_dev(body, t15);
			append_dev(body, p12);
			append_dev(p12, t16);
			append_dev(p12, br2);
			append_dev(p12, t17);
			append_dev(p12, br3);
			append_dev(p12, t18);
			append_dev(p12, br4);
			append_dev(p12, t19);
			append_dev(p12, br5);
			append_dev(p12, t20);
			append_dev(p12, br6);
			append_dev(p12, t21);
			append_dev(p12, br7);
			append_dev(p12, t22);
			append_dev(p12, br8);
			append_dev(p12, t23);
			append_dev(p12, br9);
			append_dev(body, t24);
			append_dev(body, h5);
			append_dev(body, p13);
			append_dev(p13, t26);
			append_dev(p13, br10);
			append_dev(p13, t27);
			append_dev(p13, br11);
			append_dev(p13, t28);
			append_dev(p13, br12);
			append_dev(p13, t29);
			append_dev(p13, br13);
			append_dev(p13, t30);
			append_dev(p13, br14);
			append_dev(p13, t31);
			append_dev(body, t32);
			append_dev(body, hr3);
			append_dev(body, t33);
			append_dev(body, center3);
			append_dev(center3, h33);
			append_dev(body, t35);
			append_dev(body, p14);
			append_dev(p14, t36);
			append_dev(p14, br15);
			append_dev(p14, t37);
			append_dev(p14, br16);
			append_dev(p14, t38);
			append_dev(p14, br17);
			append_dev(p14, t39);
			append_dev(p14, br18);
			append_dev(p14, t40);
			append_dev(p14, br19);
			append_dev(p14, t41);
			append_dev(p14, br20);
			append_dev(p14, t42);
			append_dev(p14, br21);
			append_dev(p14, t43);
			append_dev(body, t44);
			append_dev(body, hr4);
			append_dev(body, t45);
			append_dev(body, center4);
			append_dev(center4, h34);
			append_dev(body, t47);
			append_dev(body, p15);
			append_dev(p15, t48);
			append_dev(p15, br22);
			append_dev(p15, t49);
			append_dev(p15, br23);
			append_dev(p15, t50);
			append_dev(p15, br24);
			append_dev(p15, t51);
			append_dev(p15, br25);
			append_dev(p15, t52);
			append_dev(body, t53);
			append_dev(body, hr5);
			append_dev(body, t54);
			append_dev(body, center5);
			append_dev(center5, h35);
			append_dev(body, t56);
			append_dev(body, p16);
			append_dev(p16, t57);
			append_dev(p16, br26);
			append_dev(p16, t58);
			append_dev(p16, br27);
			append_dev(p16, t59);
			append_dev(p16, br28);
			append_dev(p16, t60);
			append_dev(p16, br29);
			append_dev(p16, t61);
			append_dev(p16, br30);
			append_dev(p16, t62);
			append_dev(p16, br31);
			append_dev(p16, t63);
			append_dev(body, br32);
			append_dev(body, t64);
			append_dev(body, hr6);
			append_dev(body, t65);
			append_dev(body, center6);
			append_dev(center6, h36);
			append_dev(body, t67);
			append_dev(body, p17);
			append_dev(p17, t68);
			append_dev(p17, br33);
			append_dev(p17, t69);
			append_dev(p17, br34);
			append_dev(p17, t70);
			append_dev(body, br35);
			append_dev(body, t71);
			append_dev(body, hr7);
			append_dev(body, t72);
			append_dev(body, center7);
			append_dev(center7, h37);
			append_dev(body, t74);
			append_dev(body, p18);
			append_dev(p18, t75);
			append_dev(p18, br36);
			append_dev(p18, t76);
			append_dev(p18, br37);
			append_dev(p18, t77);
			append_dev(p18, br38);
			append_dev(p18, t78);
			append_dev(p18, br39);
			append_dev(p18, t79);
			append_dev(p18, br40);
			append_dev(p18, t80);
			append_dev(body, t81);
			append_dev(body, hr8);
			append_dev(body, t82);
			append_dev(body, center8);
			append_dev(center8, h38);
			append_dev(body, t84);
			append_dev(body, p19);
			append_dev(p19, t85);
			append_dev(p19, br41);
			append_dev(p19, t86);
			append_dev(p19, br42);
			append_dev(p19, t87);
			append_dev(p19, br43);
			append_dev(p19, t88);
			append_dev(p19, br44);
			append_dev(p19, br45);
			append_dev(p19, t89);
			append_dev(p19, br46);
			append_dev(p19, t90);
			append_dev(p19, br47);
			append_dev(body, t91);
			append_dev(body, center9);
			append_dev(center9, iframe);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*darkmode, fontmode*/ 3 && body_class_value !== (body_class_value = /*darkmode*/ ctx[0] + /*fontmode*/ ctx[1])) {
				attr_dev(body, "class", body_class_value);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(head);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(body);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$5($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('DepressContest', slots, []);
	let { darkmode } = $$props;
	let { fontmode } = $$props;
	const writable_props = ['darkmode', 'fontmode'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DepressContest> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('darkmode' in $$props) $$invalidate(0, darkmode = $$props.darkmode);
		if ('fontmode' in $$props) $$invalidate(1, fontmode = $$props.fontmode);
	};

	$$self.$capture_state = () => ({ darkmode, fontmode });

	$$self.$inject_state = $$props => {
		if ('darkmode' in $$props) $$invalidate(0, darkmode = $$props.darkmode);
		if ('fontmode' in $$props) $$invalidate(1, fontmode = $$props.fontmode);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [darkmode, fontmode];
}

class DepressContest extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$5, create_fragment$5, safe_not_equal, { darkmode: 0, fontmode: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DepressContest",
			options,
			id: create_fragment$5.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*darkmode*/ ctx[0] === undefined && !('darkmode' in props)) {
			console.warn("<DepressContest> was created without expected prop 'darkmode'");
		}

		if (/*fontmode*/ ctx[1] === undefined && !('fontmode' in props)) {
			console.warn("<DepressContest> was created without expected prop 'fontmode'");
		}
	}

	get darkmode() {
		throw new Error("<DepressContest>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set darkmode(value) {
		throw new Error("<DepressContest>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get fontmode() {
		throw new Error("<DepressContest>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set fontmode(value) {
		throw new Error("<DepressContest>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\post_list\nomallt.svelte generated by Svelte v3.46.4 */

const file$4 = "src\\post_list\\nomallt.svelte";

function create_fragment$4(ctx) {
	let head;
	let t0;
	let body;
	let hr0;
	let t1;
	let center;
	let h3;
	let t3;
	let p1;
	let t5;
	let hr1;
	let body_class_value;

	const block = {
		c: function create() {
			head = element("head");
			t0 = space();
			body = element("body");
			hr0 = element("hr");
			t1 = space();
			center = element("center");
			h3 = element("h3");
			h3.textContent = "제목 (일반)";
			t3 = space();
			p1 = element("p1");
			p1.textContent = "글";
			t5 = space();
			hr1 = element("hr");
			add_location(head, file$4, 4, 4, 80);
			add_location(hr0, file$4, 7, 4, 143);
			add_location(h3, file$4, 9, 4, 167);
			add_location(center, file$4, 8, 4, 153);
			add_location(p1, file$4, 11, 4, 206);
			add_location(hr1, file$4, 12, 4, 224);
			attr_dev(body, "class", body_class_value = /*darkmode*/ ctx[0] + /*fontmode*/ ctx[1]);
			add_location(body, file$4, 6, 4, 105);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, head, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, body, anchor);
			append_dev(body, hr0);
			append_dev(body, t1);
			append_dev(body, center);
			append_dev(center, h3);
			append_dev(body, t3);
			append_dev(body, p1);
			append_dev(body, t5);
			append_dev(body, hr1);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*darkmode, fontmode*/ 3 && body_class_value !== (body_class_value = /*darkmode*/ ctx[0] + /*fontmode*/ ctx[1])) {
				attr_dev(body, "class", body_class_value);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(head);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(body);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Nomallt', slots, []);
	let { darkmode } = $$props;
	let { fontmode } = $$props;
	const writable_props = ['darkmode', 'fontmode'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nomallt> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('darkmode' in $$props) $$invalidate(0, darkmode = $$props.darkmode);
		if ('fontmode' in $$props) $$invalidate(1, fontmode = $$props.fontmode);
	};

	$$self.$capture_state = () => ({ darkmode, fontmode });

	$$self.$inject_state = $$props => {
		if ('darkmode' in $$props) $$invalidate(0, darkmode = $$props.darkmode);
		if ('fontmode' in $$props) $$invalidate(1, fontmode = $$props.fontmode);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [darkmode, fontmode];
}

class Nomallt extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { darkmode: 0, fontmode: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Nomallt",
			options,
			id: create_fragment$4.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*darkmode*/ ctx[0] === undefined && !('darkmode' in props)) {
			console.warn("<Nomallt> was created without expected prop 'darkmode'");
		}

		if (/*fontmode*/ ctx[1] === undefined && !('fontmode' in props)) {
			console.warn("<Nomallt> was created without expected prop 'fontmode'");
		}
	}

	get darkmode() {
		throw new Error("<Nomallt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set darkmode(value) {
		throw new Error("<Nomallt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get fontmode() {
		throw new Error("<Nomallt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set fontmode(value) {
		throw new Error("<Nomallt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\post_list\tech.svelte generated by Svelte v3.46.4 */

const file$3 = "src\\post_list\\tech.svelte";

function create_fragment$3(ctx) {
	let head;
	let t0;
	let body;
	let hr0;
	let t1;
	let center;
	let h3;
	let t3;
	let p1;
	let t4;
	let br0;
	let t5;
	let br1;
	let t6;
	let br2;
	let t7;
	let hr1;
	let body_class_value;

	const block = {
		c: function create() {
			head = element("head");
			t0 = space();
			body = element("body");
			hr0 = element("hr");
			t1 = space();
			center = element("center");
			h3 = element("h3");
			h3.textContent = "code convention";
			t3 = space();
			p1 = element("p1");
			t4 = text("Coding conventions are a set of guidelines for a specific programming language that recommend programming style, practices, and methods for each aspect of a program written in that language.\r\n    ");
			br0 = element("br");
			t5 = text(" code convention  : 프로그램 작성시에 추천되는 스타일, 관습, 그리고 문법상에서의 각각의 요소를 의미한다. ");
			br1 = element("br");
			t6 = text("\r\n    naming convention : 가독성을 좋게 하기위하여, 변수명을 naming할때 쓰는 규칙, 카멜, 파스칼 케이스 등이 있다.\r\n    ");
			br2 = element("br");
			t7 = space();
			hr1 = element("hr");
			add_location(head, file$3, 5, 0, 78);
			add_location(hr0, file$3, 8, 4, 137);
			add_location(h3, file$3, 10, 4, 161);
			add_location(center, file$3, 9, 4, 147);
			add_location(br0, file$3, 13, 4, 409);
			add_location(br1, file$3, 13, 77, 482);
			add_location(br2, file$3, 15, 4, 572);
			add_location(p1, file$3, 12, 4, 208);
			add_location(hr1, file$3, 20, 4, 600);
			attr_dev(body, "class", body_class_value = /*darkmode*/ ctx[0] + /*fontmode*/ ctx[1]);
			add_location(body, file$3, 7, 4, 99);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, head, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, body, anchor);
			append_dev(body, hr0);
			append_dev(body, t1);
			append_dev(body, center);
			append_dev(center, h3);
			append_dev(body, t3);
			append_dev(body, p1);
			append_dev(p1, t4);
			append_dev(p1, br0);
			append_dev(p1, t5);
			append_dev(p1, br1);
			append_dev(p1, t6);
			append_dev(p1, br2);
			append_dev(body, t7);
			append_dev(body, hr1);
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*darkmode, fontmode*/ 3 && body_class_value !== (body_class_value = /*darkmode*/ ctx[0] + /*fontmode*/ ctx[1])) {
				attr_dev(body, "class", body_class_value);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(head);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(body);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Tech', slots, []);
	let { darkmode } = $$props;
	let { fontmode } = $$props;
	const writable_props = ['darkmode', 'fontmode'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tech> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('darkmode' in $$props) $$invalidate(0, darkmode = $$props.darkmode);
		if ('fontmode' in $$props) $$invalidate(1, fontmode = $$props.fontmode);
	};

	$$self.$capture_state = () => ({ darkmode, fontmode });

	$$self.$inject_state = $$props => {
		if ('darkmode' in $$props) $$invalidate(0, darkmode = $$props.darkmode);
		if ('fontmode' in $$props) $$invalidate(1, fontmode = $$props.fontmode);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [darkmode, fontmode];
}

class Tech extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { darkmode: 0, fontmode: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Tech",
			options,
			id: create_fragment$3.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*darkmode*/ ctx[0] === undefined && !('darkmode' in props)) {
			console.warn("<Tech> was created without expected prop 'darkmode'");
		}

		if (/*fontmode*/ ctx[1] === undefined && !('fontmode' in props)) {
			console.warn("<Tech> was created without expected prop 'fontmode'");
		}
	}

	get darkmode() {
		throw new Error("<Tech>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set darkmode(value) {
		throw new Error("<Tech>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get fontmode() {
		throw new Error("<Tech>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set fontmode(value) {
		throw new Error("<Tech>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\post_list\something2.svelte generated by Svelte v3.46.4 */
const file$2 = "src\\post_list\\something2.svelte";

// (31:22) 
function create_if_block_2$1(ctx) {
	let div;
	let depressful;
	let current;

	depressful = new DepressContest({
			props: {
				darkmode: /*darkmode*/ ctx[1],
				fontmode: /*font_mode*/ ctx[2]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(depressful.$$.fragment);
			add_location(div, file$2, 31, 0, 573);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(depressful, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const depressful_changes = {};
			if (dirty & /*darkmode*/ 2) depressful_changes.darkmode = /*darkmode*/ ctx[1];
			if (dirty & /*font_mode*/ 4) depressful_changes.fontmode = /*font_mode*/ ctx[2];
			depressful.$set(depressful_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(depressful.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(depressful.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(depressful);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$1.name,
		type: "if",
		source: "(31:22) ",
		ctx
	});

	return block;
}

// (25:19) 
function create_if_block_1$2(ctx) {
	let div;
	let nomal;
	let current;

	nomal = new Nomallt({
			props: {
				darkmode: /*darkmode*/ ctx[1],
				fontmode: /*font_mode*/ ctx[2]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(nomal.$$.fragment);
			add_location(div, file$2, 25, 0, 465);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(nomal, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const nomal_changes = {};
			if (dirty & /*darkmode*/ 2) nomal_changes.darkmode = /*darkmode*/ ctx[1];
			if (dirty & /*font_mode*/ 4) nomal_changes.fontmode = /*font_mode*/ ctx[2];
			nomal.$set(nomal_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(nomal.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(nomal.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(nomal);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$2.name,
		type: "if",
		source: "(25:19) ",
		ctx
	});

	return block;
}

// (19:0) {#if code ==2}
function create_if_block$2(ctx) {
	let tech;
	let current;

	tech = new Tech({
			props: {
				darkmode: /*darkmode*/ ctx[1],
				fontmode: /*font_mode*/ ctx[2]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(tech.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(tech, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const tech_changes = {};
			if (dirty & /*darkmode*/ 2) tech_changes.darkmode = /*darkmode*/ ctx[1];
			if (dirty & /*font_mode*/ 4) tech_changes.fontmode = /*font_mode*/ ctx[2];
			tech.$set(tech_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(tech.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(tech.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(tech, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(19:0) {#if code ==2}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let head;
	let t;
	let body;
	let current_block_type_index;
	let if_block;
	let body_class_value;
	let current;
	const if_block_creators = [create_if_block$2, create_if_block_1$2, create_if_block_2$1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*code*/ ctx[0] == 2) return 0;
		if (/*code*/ ctx[0] == 1) return 1;
		if (/*code*/ ctx[0] == -1.12) return 2;
		return -1;
	}

	if (~(current_block_type_index = select_block_type(ctx))) {
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

	const block = {
		c: function create() {
			head = element("head");
			t = space();
			body = element("body");
			if (if_block) if_block.c();
			add_location(head, file$2, 14, 0, 313);
			attr_dev(body, "class", body_class_value = "" + (null_to_empty(/*darkmode*/ ctx[1] + /*font_mode*/ ctx[2]) + " svelte-1hzu1u5"));
			add_location(body, file$2, 17, 0, 332);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, head, anchor);
			insert_dev(target, t, anchor);
			insert_dev(target, body, anchor);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(body, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if (~current_block_type_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				}
			} else {
				if (if_block) {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
				}

				if (~current_block_type_index) {
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(body, null);
				} else {
					if_block = null;
				}
			}

			if (!current || dirty & /*darkmode, font_mode*/ 6 && body_class_value !== (body_class_value = "" + (null_to_empty(/*darkmode*/ ctx[1] + /*font_mode*/ ctx[2]) + " svelte-1hzu1u5"))) {
				attr_dev(body, "class", body_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(head);
			if (detaching) detach_dev(t);
			if (detaching) detach_dev(body);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d();
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$2($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Something2', slots, []);
	let { code } = $$props;
	let { darkmode } = $$props;
	let { font_mode } = $$props;
	let { link_of_post } = $$props;
	const writable_props = ['code', 'darkmode', 'font_mode', 'link_of_post'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Something2> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('code' in $$props) $$invalidate(0, code = $$props.code);
		if ('darkmode' in $$props) $$invalidate(1, darkmode = $$props.darkmode);
		if ('font_mode' in $$props) $$invalidate(2, font_mode = $$props.font_mode);
		if ('link_of_post' in $$props) $$invalidate(3, link_of_post = $$props.link_of_post);
	};

	$$self.$capture_state = () => ({
		code,
		darkmode,
		font_mode,
		Depressful: DepressContest,
		link_of_post,
		Nomal: Nomallt,
		Tech
	});

	$$self.$inject_state = $$props => {
		if ('code' in $$props) $$invalidate(0, code = $$props.code);
		if ('darkmode' in $$props) $$invalidate(1, darkmode = $$props.darkmode);
		if ('font_mode' in $$props) $$invalidate(2, font_mode = $$props.font_mode);
		if ('link_of_post' in $$props) $$invalidate(3, link_of_post = $$props.link_of_post);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [code, darkmode, font_mode, link_of_post];
}

class Something2 extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			code: 0,
			darkmode: 1,
			font_mode: 2,
			link_of_post: 3
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Something2",
			options,
			id: create_fragment$2.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*code*/ ctx[0] === undefined && !('code' in props)) {
			console.warn("<Something2> was created without expected prop 'code'");
		}

		if (/*darkmode*/ ctx[1] === undefined && !('darkmode' in props)) {
			console.warn("<Something2> was created without expected prop 'darkmode'");
		}

		if (/*font_mode*/ ctx[2] === undefined && !('font_mode' in props)) {
			console.warn("<Something2> was created without expected prop 'font_mode'");
		}

		if (/*link_of_post*/ ctx[3] === undefined && !('link_of_post' in props)) {
			console.warn("<Something2> was created without expected prop 'link_of_post'");
		}
	}

	get code() {
		throw new Error("<Something2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set code(value) {
		throw new Error("<Something2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get darkmode() {
		throw new Error("<Something2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set darkmode(value) {
		throw new Error("<Something2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get font_mode() {
		throw new Error("<Something2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set font_mode(value) {
		throw new Error("<Something2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get link_of_post() {
		throw new Error("<Something2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set link_of_post(value) {
		throw new Error("<Something2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\context.svelte generated by Svelte v3.46.4 */
const file$1 = "src\\context.svelte";

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[10] = list[i];
	return child_ctx;
}

// (95:12) {:else}
function create_else_block$1(ctx) {
	let div;
	let br;
	let t0;
	let center;
	let p1;

	const block = {
		c: function create() {
			div = element("div");
			br = element("br");
			t0 = space();
			center = element("center");
			p1 = element("p1");
			p1.textContent = "Welcome!";
			add_location(br, file$1, 95, 18, 3294);
			add_location(p1, file$1, 97, 16, 3342);
			add_location(center, file$1, 96, 16, 3316);
			add_location(div, file$1, 95, 12, 3288);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, br);
			append_dev(div, t0);
			append_dev(div, center);
			append_dev(center, p1);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(95:12) {:else}",
		ctx
	});

	return block;
}

// (82:45) 
function create_if_block_3(ctx) {
	let div;
	let center;
	let br0;
	let h1;
	let t0;
	let br1;
	let br2;
	let t1;
	let input;
	let t2;
	let page1;
	let current;
	let mounted;
	let dispose;

	page1 = new Something2({
			props: {
				code: /*code_on*/ ctx[3],
				darkmode: /*bg_mode*/ ctx[1],
				font_mode: /*font_mode*/ ctx[2]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			center = element("center");
			br0 = element("br");
			h1 = element("h1");
			t0 = text("Posts ");
			br1 = element("br");
			br2 = element("br");
			t1 = space();
			input = element("input");
			t2 = space();
			create_component(page1.$$.fragment);
			add_location(br0, file$1, 84, 16, 2987);
			add_location(br1, file$1, 84, 31, 3002);
			add_location(h1, file$1, 84, 20, 2991);
			add_location(br2, file$1, 84, 40, 3011);
			attr_dev(input, "size", "3");
			add_location(input, file$1, 85, 16, 3033);
			add_location(center, file$1, 83, 12, 2961);
			add_location(div, file$1, 82, 12, 2942);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, center);
			append_dev(center, br0);
			append_dev(center, h1);
			append_dev(h1, t0);
			append_dev(h1, br1);
			append_dev(center, br2);
			append_dev(center, t1);
			append_dev(center, input);
			set_input_value(input, /*code_on*/ ctx[3]);
			append_dev(div, t2);
			mount_component(page1, div, null);
			current = true;

			if (!mounted) {
				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[7]);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*code_on*/ 8 && input.value !== /*code_on*/ ctx[3]) {
				set_input_value(input, /*code_on*/ ctx[3]);
			}

			const page1_changes = {};
			if (dirty & /*code_on*/ 8) page1_changes.code = /*code_on*/ ctx[3];
			if (dirty & /*bg_mode*/ 2) page1_changes.darkmode = /*bg_mode*/ ctx[1];
			if (dirty & /*font_mode*/ 4) page1_changes.font_mode = /*font_mode*/ ctx[2];
			page1.$set(page1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(page1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(page1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(page1);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3.name,
		type: "if",
		source: "(82:45) ",
		ctx
	});

	return block;
}

// (67:46) 
function create_if_block_2(ctx) {
	let div;
	let center;
	let br0;
	let t0;
	let h2;
	let t2;
	let br1;
	let t3;
	let img;
	let img_src_value;
	let t4;
	let br2;
	let t5;
	let hr0;
	let t6;
	let p1;
	let t7;
	let br3;
	let t8;
	let br4;
	let t9;
	let br5;
	let hr1;

	const block = {
		c: function create() {
			div = element("div");
			center = element("center");
			br0 = element("br");
			t0 = space();
			h2 = element("h2");
			h2.textContent = "About Lutica";
			t2 = space();
			br1 = element("br");
			t3 = space();
			img = element("img");
			t4 = space();
			br2 = element("br");
			t5 = space();
			hr0 = element("hr");
			t6 = space();
			p1 = element("p1");
			t7 = text("I was studied Railroad engineering");
			br3 = element("br");
			t8 = text("I'm working on Game company.");
			br4 = element("br");
			t9 = text("I'm seeking VRgame develop");
			br5 = element("br");
			hr1 = element("hr");
			add_location(br0, file$1, 69, 20, 2402);
			add_location(h2, file$1, 70, 20, 2428);
			add_location(br1, file$1, 71, 20, 2473);
			attr_dev(img, "width", "50%");
			attr_dev(img, "height", "50%");
			if (!src_url_equal(img.src, img_src_value = "../src/KakaoTalk_20220322_200232462.png")) attr_dev(img, "src", img_src_value);
			add_location(img, file$1, 72, 20, 2499);
			add_location(br2, file$1, 73, 20, 2602);
			add_location(hr0, file$1, 74, 20, 2628);
			add_location(br3, file$1, 76, 58, 2733);
			add_location(br4, file$1, 76, 90, 2765);
			add_location(br5, file$1, 76, 120, 2795);
			add_location(hr1, file$1, 76, 124, 2799);
			attr_dev(p1, "class", "p-1");
			add_location(p1, file$1, 75, 20, 2654);
			add_location(center, file$1, 68, 16, 2372);
			add_location(div, file$1, 67, 12, 2349);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, center);
			append_dev(center, br0);
			append_dev(center, t0);
			append_dev(center, h2);
			append_dev(center, t2);
			append_dev(center, br1);
			append_dev(center, t3);
			append_dev(center, img);
			append_dev(center, t4);
			append_dev(center, br2);
			append_dev(center, t5);
			append_dev(center, hr0);
			append_dev(center, t6);
			append_dev(center, p1);
			append_dev(p1, t7);
			append_dev(p1, br3);
			append_dev(p1, t8);
			append_dev(p1, br4);
			append_dev(p1, t9);
			append_dev(p1, br5);
			append_dev(p1, hr1);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(67:46) ",
		ctx
	});

	return block;
}

// (56:46) 
function create_if_block_1$1(ctx) {
	let div;
	let center;
	let h3;
	let t1;
	let ul;
	let each_value = /*SNSs*/ ctx[4];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");
			center = element("center");
			h3 = element("h3");
			h3.textContent = "Lutica's contact Line :";
			t1 = space();
			ul = element("ul");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			add_location(h3, file$1, 58, 20, 1948);
			attr_dev(ul, "class", "ul");
			add_location(ul, file$1, 59, 20, 2006);
			add_location(center, file$1, 57, 16, 1918);
			add_location(div, file$1, 56, 12, 1895);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, center);
			append_dev(center, h3);
			append_dev(center, t1);
			append_dev(center, ul);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(ul, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*SNSs*/ 16) {
				each_value = /*SNSs*/ ctx[4];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(ul, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(56:46) ",
		ctx
	});

	return block;
}

// (52:12) {#if context_mode == "Home"}
function create_if_block$1(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			add_location(div, file$1, 52, 12, 1806);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(52:12) {#if context_mode == \\\"Home\\\"}",
		ctx
	});

	return block;
}

// (61:20) {#each SNSs as SNSone}
function create_each_block$1(ctx) {
	let il;
	let a;
	let p1;
	let t0_value = /*SNSone*/ ctx[10].SNS_name + "";
	let t0;
	let t1;
	let br;

	const block = {
		c: function create() {
			il = element("il");
			a = element("a");
			p1 = element("p1");
			t0 = text(t0_value);
			t1 = space();
			br = element("br");
			attr_dev(p1, "class", "");
			add_location(p1, file$1, 61, 61, 2128);
			attr_dev(a, "href", /*SNSone*/ ctx[10].href);
			add_location(a, file$1, 61, 37, 2104);
			attr_dev(il, "class", "il");
			add_location(il, file$1, 61, 20, 2087);
			add_location(br, file$1, 61, 109, 2176);
		},
		m: function mount(target, anchor) {
			insert_dev(target, il, anchor);
			append_dev(il, a);
			append_dev(a, p1);
			append_dev(p1, t0);
			insert_dev(target, t1, anchor);
			insert_dev(target, br, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(il);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(br);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(61:20) {#each SNSs as SNSone}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let head;
	let style;
	let t1;
	let meta0;
	let t2;
	let meta1;
	let t3;
	let meta2;
	let t4;
	let meta3;
	let t5;
	let title;
	let t7;
	let link0;
	let t8;
	let link1;
	let t9;
	let body;
	let div1;
	let div0;
	let current_block_type_index;
	let if_block;
	let body_class_value;
	let current;

	const if_block_creators = [
		create_if_block$1,
		create_if_block_1$1,
		create_if_block_2,
		create_if_block_3,
		create_else_block$1
	];

	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*context_mode*/ ctx[0] == "Home") return 0;
		if (/*context_mode*/ ctx[0] == "Contact") return 1;
		if (/*context_mode*/ ctx[0] == "Profile") return 2;
		if (/*context_mode*/ ctx[0] == "Posts") return 3;
		return 4;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			head = element("head");
			style = element("style");
			style.textContent = "body {\r\n            width : \"device-width\";\r\n            height : \"device-height\"\r\n        }\r\n        table {\r\n    width: 100%;\r\n    border: 1px solid #444444;\r\n  }";
			t1 = space();
			meta0 = element("meta");
			t2 = space();
			meta1 = element("meta");
			t3 = space();
			meta2 = element("meta");
			t4 = space();
			meta3 = element("meta");
			t5 = space();
			title = element("title");
			title.textContent = "Simple Sidebar - Start Bootstrap Template";
			t7 = space();
			link0 = element("link");
			t8 = space();
			link1 = element("link");
			t9 = space();
			body = element("body");
			div1 = element("div");
			div0 = element("div");
			if_block.c();
			add_location(style, file$1, 28, 4, 998);
			attr_dev(meta0, "charset", "utf-8");
			add_location(meta0, file$1, 38, 4, 1199);
			attr_dev(meta1, "name", "viewport");
			attr_dev(meta1, "content", "width=device-width, initial-scale=1, shrink-to-fit=no");
			add_location(meta1, file$1, 39, 4, 1229);
			attr_dev(meta2, "name", "description");
			attr_dev(meta2, "content", "");
			add_location(meta2, file$1, 40, 4, 1323);
			attr_dev(meta3, "name", "author");
			attr_dev(meta3, "content", "");
			add_location(meta3, file$1, 41, 4, 1367);
			add_location(title, file$1, 42, 4, 1406);
			attr_dev(link0, "rel", "icon");
			attr_dev(link0, "type", "image/x-icon");
			attr_dev(link0, "href", "assets/favicon.ico");
			add_location(link0, file$1, 44, 4, 1489);
			attr_dev(link1, "href", "../build/styles.css");
			attr_dev(link1, "rel", "stylesheet");
			add_location(link1, file$1, 46, 4, 1609);
			add_location(head, file$1, 27, 0, 986);
			add_location(div0, file$1, 50, 8, 1745);
			attr_dev(div1, "id", "all_wrap");
			add_location(div1, file$1, 49, 4, 1712);
			attr_dev(body, "class", body_class_value = "" + (null_to_empty(/*bg_mode*/ ctx[1] + /*font_mode*/ ctx[2]) + " svelte-vnh244"));
			add_location(body, file$1, 48, 0, 1671);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, head, anchor);
			append_dev(head, style);
			append_dev(head, t1);
			append_dev(head, meta0);
			append_dev(head, t2);
			append_dev(head, meta1);
			append_dev(head, t3);
			append_dev(head, meta2);
			append_dev(head, t4);
			append_dev(head, meta3);
			append_dev(head, t5);
			append_dev(head, title);
			append_dev(head, t7);
			append_dev(head, link0);
			append_dev(head, t8);
			append_dev(head, link1);
			insert_dev(target, t9, anchor);
			insert_dev(target, body, anchor);
			append_dev(body, div1);
			append_dev(div1, div0);
			if_blocks[current_block_type_index].m(div0, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(div0, null);
			}

			if (!current || dirty & /*bg_mode, font_mode*/ 6 && body_class_value !== (body_class_value = "" + (null_to_empty(/*bg_mode*/ ctx[1] + /*font_mode*/ ctx[2]) + " svelte-vnh244"))) {
				attr_dev(body, "class", body_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(head);
			if (detaching) detach_dev(t9);
			if (detaching) detach_dev(body);
			if_blocks[current_block_type_index].d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Context', slots, []);
	let { context_mode } = $$props;
	let { bg_mode } = $$props;
	let { font_mode } = $$props;
	let { size_all } = $$props;
	let { size_bar } = $$props;
	let readmode = false;

	let post_tree = [
		{
			"id": 1,
			"name": "something",
			"tree": "something.html",
			"time": "2022.04.01",
			"readmode": false
		},
		{
			"id": 2,
			"name": "something?",
			"tree": "something2.svelte",
			"time": "2022.04.01",
			"readmode": false
		}
	];

	let SNSs = [
		{
			"SNS_name": "Twitter : @presan100",
			"href": "https://twitter.com/presan100"
		},
		{
			"SNS_name": "Instargram : @presan100",
			"href": "https://www.instagram.com/lutica_canard"
		},
		{
			"SNS_name": "Github : LuticaCANARD ",
			"href": "https://github.com/LuticaCANARD"
		}
	];

	let code_on = 1;
	const writable_props = ['context_mode', 'bg_mode', 'font_mode', 'size_all', 'size_bar'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Context> was created with unknown prop '${key}'`);
	});

	function input_input_handler() {
		code_on = this.value;
		$$invalidate(3, code_on);
	}

	$$self.$$set = $$props => {
		if ('context_mode' in $$props) $$invalidate(0, context_mode = $$props.context_mode);
		if ('bg_mode' in $$props) $$invalidate(1, bg_mode = $$props.bg_mode);
		if ('font_mode' in $$props) $$invalidate(2, font_mode = $$props.font_mode);
		if ('size_all' in $$props) $$invalidate(5, size_all = $$props.size_all);
		if ('size_bar' in $$props) $$invalidate(6, size_bar = $$props.size_bar);
	};

	$$self.$capture_state = () => ({
		context_mode,
		bg_mode,
		font_mode,
		size_all,
		size_bar,
		readmode,
		post_tree,
		SNSs,
		Page1: Something2,
		code_on
	});

	$$self.$inject_state = $$props => {
		if ('context_mode' in $$props) $$invalidate(0, context_mode = $$props.context_mode);
		if ('bg_mode' in $$props) $$invalidate(1, bg_mode = $$props.bg_mode);
		if ('font_mode' in $$props) $$invalidate(2, font_mode = $$props.font_mode);
		if ('size_all' in $$props) $$invalidate(5, size_all = $$props.size_all);
		if ('size_bar' in $$props) $$invalidate(6, size_bar = $$props.size_bar);
		if ('readmode' in $$props) readmode = $$props.readmode;
		if ('post_tree' in $$props) post_tree = $$props.post_tree;
		if ('SNSs' in $$props) $$invalidate(4, SNSs = $$props.SNSs);
		if ('code_on' in $$props) $$invalidate(3, code_on = $$props.code_on);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		context_mode,
		bg_mode,
		font_mode,
		code_on,
		SNSs,
		size_all,
		size_bar,
		input_input_handler
	];
}

class Context extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
			context_mode: 0,
			bg_mode: 1,
			font_mode: 2,
			size_all: 5,
			size_bar: 6
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Context",
			options,
			id: create_fragment$1.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*context_mode*/ ctx[0] === undefined && !('context_mode' in props)) {
			console.warn("<Context> was created without expected prop 'context_mode'");
		}

		if (/*bg_mode*/ ctx[1] === undefined && !('bg_mode' in props)) {
			console.warn("<Context> was created without expected prop 'bg_mode'");
		}

		if (/*font_mode*/ ctx[2] === undefined && !('font_mode' in props)) {
			console.warn("<Context> was created without expected prop 'font_mode'");
		}

		if (/*size_all*/ ctx[5] === undefined && !('size_all' in props)) {
			console.warn("<Context> was created without expected prop 'size_all'");
		}

		if (/*size_bar*/ ctx[6] === undefined && !('size_bar' in props)) {
			console.warn("<Context> was created without expected prop 'size_bar'");
		}
	}

	get context_mode() {
		throw new Error("<Context>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set context_mode(value) {
		throw new Error("<Context>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get bg_mode() {
		throw new Error("<Context>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set bg_mode(value) {
		throw new Error("<Context>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get font_mode() {
		throw new Error("<Context>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set font_mode(value) {
		throw new Error("<Context>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size_all() {
		throw new Error("<Context>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size_all(value) {
		throw new Error("<Context>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get size_bar() {
		throw new Error("<Context>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set size_bar(value) {
		throw new Error("<Context>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\App.svelte generated by Svelte v3.46.4 */

const { console: console_1 } = globals;
const file = "src\\App.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[17] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[17] = list[i];
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[22] = list[i];
	return child_ctx;
}

// (73:20) {#each menu_listsk1 as menu (menu.id) }
function create_each_block_2(key_1, ctx) {
	let il;
	let a;
	let t_value = /*menu*/ ctx[22].label + "";
	let t;
	let a_class_value;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[10](/*menu*/ ctx[22]);
	}

	const block = {
		key: key_1,
		first: null,
		c: function create() {
			il = element("il");
			a = element("a");
			t = text(t_value);
			attr_dev(a, "class", a_class_value = "list-group-item list-group-item-action " + /*List_item_bgcolor*/ ctx[3] + /*font_mode*/ ctx[2] + " p-3");
			attr_dev(a, "href", /*menu*/ ctx[22].href);
			add_location(a, file, 73, 28, 3511);
			add_location(il, file, 73, 24, 3507);
			this.first = il;
		},
		m: function mount(target, anchor) {
			insert_dev(target, il, anchor);
			append_dev(il, a);
			append_dev(a, t);

			if (!mounted) {
				dispose = listen_dev(a, "click", click_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*List_item_bgcolor, font_mode*/ 12 && a_class_value !== (a_class_value = "list-group-item list-group-item-action " + /*List_item_bgcolor*/ ctx[3] + /*font_mode*/ ctx[2] + " p-3")) {
				attr_dev(a, "class", a_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(il);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_2.name,
		type: "each",
		source: "(73:20) {#each menu_listsk1 as menu (menu.id) }",
		ctx
	});

	return block;
}

// (84:145) {:else}
function create_else_block_1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("White ");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1.name,
		type: "else",
		source: "(84:145) {:else}",
		ctx
	});

	return block;
}

// (84:111) {#if is_darkmode=="bg-white"}
function create_if_block_1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Dark ");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(84:111) {#if is_darkmode==\\\"bg-white\\\"}",
		ctx
	});

	return block;
}

// (88:32) {#each menu_listsk1 as drop}
function create_each_block_1(ctx) {
	let li;
	let a;
	let t_value = /*drop*/ ctx[17].label + "";
	let t;
	let li_class_value;
	let mounted;
	let dispose;

	function click_handler_1() {
		return /*click_handler_1*/ ctx[11](/*drop*/ ctx[17]);
	}

	const block = {
		c: function create() {
			li = element("li");
			a = element("a");
			t = text(t_value);
			attr_dev(a, "class", "nav-link");
			attr_dev(a, "href", /*drop*/ ctx[17].href);
			add_location(a, file, 88, 91, 4857);
			attr_dev(li, "class", li_class_value = "nav-item active " + /*is_darkmode_light*/ ctx[1] + /*font_mode*/ ctx[2]);
			add_location(li, file, 88, 32, 4798);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a);
			append_dev(a, t);

			if (!mounted) {
				dispose = listen_dev(a, "click", click_handler_1, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*is_darkmode_light, font_mode*/ 6 && li_class_value !== (li_class_value = "nav-item active " + /*is_darkmode_light*/ ctx[1] + /*font_mode*/ ctx[2])) {
				attr_dev(li, "class", li_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(88:32) {#each menu_listsk1 as drop}",
		ctx
	});

	return block;
}

// (94:40) {#each dropdown as drop}
function create_each_block(ctx) {
	let a;
	let t_value = /*drop*/ ctx[17].label + "";
	let t;
	let a_class_value;

	const block = {
		c: function create() {
			a = element("a");
			t = text(t_value);
			attr_dev(a, "class", a_class_value = "dropdown-item" + /*font_mode*/ ctx[2]);
			attr_dev(a, "href", /*drop*/ ctx[17].href);
			add_location(a, file, 94, 40, 5500);
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);
			append_dev(a, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*font_mode*/ 4 && a_class_value !== (a_class_value = "dropdown-item" + /*font_mode*/ ctx[2])) {
				attr_dev(a, "class", a_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(94:40) {#each dropdown as drop}",
		ctx
	});

	return block;
}

// (99:160) {:else}
function create_else_block(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Whitemode");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(99:160) {:else}",
		ctx
	});

	return block;
}

// (99:123) {#if is_darkmode=="bg-white"}
function create_if_block(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Darkmode");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(99:123) {#if is_darkmode==\\\"bg-white\\\"}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let head;
	let meta0;
	let t0;
	let meta1;
	let t1;
	let meta2;
	let t2;
	let meta3;
	let t3;
	let title;
	let t5;
	let link0;
	let t6;
	let link1;
	let t7;
	let body;
	let div9;
	let div2;
	let div0;
	let t8;
	let div0_class_value;
	let t9;
	let div1;
	let each_blocks_2 = [];
	let each0_lookup = new Map();
	let div2_class_value;
	let t10;
	let div8;
	let nav;
	let div6;
	let button0;
	let t11;
	let t12;
	let t13;
	let button1;
	let span;
	let t14;
	let div5;
	let ul;
	let t15;
	let li;
	let a0;
	let t17;
	let div4;
	let t18;
	let div3;
	let t19;
	let a1;
	let t20;
	let a1_class_value;
	let div4_class_value;
	let div5_class_value;
	let div6_resize_listener;
	let nav_class_value;
	let t21;
	let div7;
	let inner_context;
	let t22;
	let script;
	let script_src_value;
	let current;
	let mounted;
	let dispose;
	let each_value_2 = /*menu_listsk1*/ ctx[7];
	validate_each_argument(each_value_2);
	const get_key = ctx => /*menu*/ ctx[22].id;
	validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);

	for (let i = 0; i < each_value_2.length; i += 1) {
		let child_ctx = get_each_context_2(ctx, each_value_2, i);
		let key = get_key(child_ctx);
		each0_lookup.set(key, each_blocks_2[i] = create_each_block_2(key, child_ctx));
	}

	function select_block_type(ctx, dirty) {
		if (/*is_darkmode*/ ctx[0] == "bg-white") return create_if_block_1;
		return create_else_block_1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);
	let each_value_1 = /*menu_listsk1*/ ctx[7];
	validate_each_argument(each_value_1);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let each_value = /*dropdown*/ ctx[8];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	function select_block_type_1(ctx, dirty) {
		if (/*is_darkmode*/ ctx[0] == "bg-white") return create_if_block;
		return create_else_block;
	}

	let current_block_type_1 = select_block_type_1(ctx);
	let if_block1 = current_block_type_1(ctx);

	inner_context = new Context({
			props: {
				context_mode: /*content_mode*/ ctx[5],
				bg_mode: /*is_darkmode_light*/ ctx[1],
				font_mode: /*font_mode*/ ctx[2],
				size_all: "device-width",
				size_bar: ""
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			head = element("head");
			meta0 = element("meta");
			t0 = space();
			meta1 = element("meta");
			t1 = space();
			meta2 = element("meta");
			t2 = space();
			meta3 = element("meta");
			t3 = space();
			title = element("title");
			title.textContent = "Simple Sidebar - Start Bootstrap Template";
			t5 = space();
			link0 = element("link");
			t6 = space();
			link1 = element("link");
			t7 = space();
			body = element("body");
			div9 = element("div");
			div2 = element("div");
			div0 = element("div");
			t8 = text("Lutica's field");
			t9 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].c();
			}

			t10 = space();
			div8 = element("div");
			nav = element("nav");
			div6 = element("div");
			button0 = element("button");
			t11 = text("Change to ");
			if_block0.c();
			t12 = text("mode");
			t13 = space();
			button1 = element("button");
			span = element("span");
			t14 = space();
			div5 = element("div");
			ul = element("ul");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t15 = space();
			li = element("li");
			a0 = element("a");
			a0.textContent = "other_menu";
			t17 = space();
			div4 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t18 = space();
			div3 = element("div");
			t19 = space();
			a1 = element("a");
			t20 = text("Change to ");
			if_block1.c();
			t21 = space();
			div7 = element("div");
			create_component(inner_context.$$.fragment);
			t22 = space();
			script = element("script");
			attr_dev(meta0, "charset", "utf-8");
			add_location(meta0, file, 54, 8, 2530);
			attr_dev(meta1, "name", "viewport");
			attr_dev(meta1, "content", "width=device-width, initial-scale=1, shrink-to-fit=no");
			add_location(meta1, file, 55, 8, 2563);
			attr_dev(meta2, "name", "description");
			attr_dev(meta2, "content", "");
			add_location(meta2, file, 56, 8, 2660);
			attr_dev(meta3, "name", "author");
			attr_dev(meta3, "content", "");
			add_location(meta3, file, 57, 8, 2707);
			add_location(title, file, 58, 8, 2749);
			attr_dev(link0, "rel", "icon");
			attr_dev(link0, "type", "image/x-icon");
			attr_dev(link0, "href", "assets/favicon.ico");
			add_location(link0, file, 60, 8, 2838);
			attr_dev(link1, "href", "../build/styles.css");
			attr_dev(link1, "rel", "stylesheet");
			add_location(link1, file, 62, 8, 2964);
			add_location(head, file, 53, 4, 2515);
			attr_dev(div0, "class", div0_class_value = "sidebar-heading border-bottom" + /*is_darkmode_light*/ ctx[1] + /*font_mode*/ ctx[2]);
			add_location(div0, file, 70, 15, 3271);
			attr_dev(div1, "class", "list-group list-group-flush");
			add_location(div1, file, 71, 16, 3381);
			attr_dev(div2, "class", div2_class_value = "border-end " + /*is_darkmode_light*/ ctx[1]);
			attr_dev(div2, "id", "sidebar-wrapper");
			attr_dev(div2, "rel", "../build/styles.css");
			add_location(div2, file, 69, 12, 3163);
			attr_dev(button0, "class", "btn btn-primary");
			attr_dev(button0, "id", "sidebarToggle");
			add_location(button0, file, 83, 24, 4088);
			attr_dev(span, "class", "navbar-toggler-icon");
			add_location(span, file, 84, 228, 4469);
			attr_dev(button1, "class", "navbar-toggler");
			attr_dev(button1, "type", "button");
			attr_dev(button1, "data-bs-toggle", "collapse");
			attr_dev(button1, "data-bs-target", "#navbarSupportedContent");
			attr_dev(button1, "aria-controls", "navbarSupportedContent");
			attr_dev(button1, "aria-expanded", "false");
			attr_dev(button1, "aria-label", "Toggle navigation");
			add_location(button1, file, 84, 24, 4265);
			attr_dev(a0, "class", "nav-link dropdown-toggle");
			attr_dev(a0, "id", "navbarDropdown");
			attr_dev(a0, "href", "#");
			attr_dev(a0, "role", "button");
			attr_dev(a0, "data-bs-toggle", "dropdown");
			attr_dev(a0, "aria-haspopup", "true");
			attr_dev(a0, "aria-expanded", "false");
			add_location(a0, file, 91, 36, 5096);
			attr_dev(div3, "class", "dropdown-divider");
			add_location(div3, file, 96, 40, 5660);
			attr_dev(a1, "class", a1_class_value = "dropdown-item" + /*font_mode*/ ctx[2]);
			attr_dev(a1, "href", "#!");
			add_location(a1, file, 98, 40, 5776);
			attr_dev(div4, "class", div4_class_value = "dropdown-menu dropdown-menu-end " + /*is_darkmode_light*/ ctx[1]);
			attr_dev(div4, "aria-labelledby", "navbarDropdown");
			add_location(div4, file, 92, 36, 5295);
			attr_dev(li, "class", "nav-item dropdown");
			add_location(li, file, 90, 32, 5029);
			attr_dev(ul, "class", "navbar-nav ms-auto mt-2 mt-lg-0");
			add_location(ul, file, 86, 28, 4660);
			attr_dev(div5, "class", div5_class_value = "collapse navbar-collapse " + /*is_darkmode_light*/ ctx[1]);
			attr_dev(div5, "id", "navbarSupportedContent");
			add_location(div5, file, 85, 24, 4544);
			attr_dev(div6, "class", "container-fluid");
			add_render_callback(() => /*div6_elementresize_handler*/ ctx[12].call(div6));
			add_location(div6, file, 81, 20, 3998);
			attr_dev(nav, "class", nav_class_value = "navbar navbar-expand-lg " + /*nav_bar*/ ctx[4] + " " + /*List_item_bgcolor*/ ctx[3] + " border-bottom");
			add_location(nav, file, 80, 16, 3890);
			add_location(div7, file, 105, 4, 6122);
			attr_dev(div8, "id", "page-content-wrapper");
			add_location(div8, file, 78, 12, 3803);
			if (!src_url_equal(script.src, script_src_value = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js")) attr_dev(script, "src", script_src_value);
			add_location(script, file, 116, 8, 6470);
			attr_dev(div9, "class", "d-flex");
			attr_dev(div9, "id", "wrapper");
			add_location(div9, file, 67, 8, 3089);
			attr_dev(body, "class", /*is_darkmode_light*/ ctx[1]);
			add_location(body, file, 66, 4, 3046);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, head, anchor);
			append_dev(head, meta0);
			append_dev(head, t0);
			append_dev(head, meta1);
			append_dev(head, t1);
			append_dev(head, meta2);
			append_dev(head, t2);
			append_dev(head, meta3);
			append_dev(head, t3);
			append_dev(head, title);
			append_dev(head, t5);
			append_dev(head, link0);
			append_dev(head, t6);
			append_dev(head, link1);
			insert_dev(target, t7, anchor);
			insert_dev(target, body, anchor);
			append_dev(body, div9);
			append_dev(div9, div2);
			append_dev(div2, div0);
			append_dev(div0, t8);
			append_dev(div2, t9);
			append_dev(div2, div1);

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].m(div1, null);
			}

			append_dev(div9, t10);
			append_dev(div9, div8);
			append_dev(div8, nav);
			append_dev(nav, div6);
			append_dev(div6, button0);
			append_dev(button0, t11);
			if_block0.m(button0, null);
			append_dev(button0, t12);
			append_dev(div6, t13);
			append_dev(div6, button1);
			append_dev(button1, span);
			append_dev(div6, t14);
			append_dev(div6, div5);
			append_dev(div5, ul);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(ul, null);
			}

			append_dev(ul, t15);
			append_dev(ul, li);
			append_dev(li, a0);
			append_dev(li, t17);
			append_dev(li, div4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div4, null);
			}

			append_dev(div4, t18);
			append_dev(div4, div3);
			append_dev(div4, t19);
			append_dev(div4, a1);
			append_dev(a1, t20);
			if_block1.m(a1, null);
			div6_resize_listener = add_resize_listener(div6, /*div6_elementresize_handler*/ ctx[12].bind(div6));
			append_dev(div8, t21);
			append_dev(div8, div7);
			mount_component(inner_context, div7, null);
			append_dev(div9, t22);
			append_dev(div9, script);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*funis_darkmode*/ ctx[9], false, false, false),
					listen_dev(a1, "click", /*funis_darkmode*/ ctx[9], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*is_darkmode_light, font_mode*/ 6 && div0_class_value !== (div0_class_value = "sidebar-heading border-bottom" + /*is_darkmode_light*/ ctx[1] + /*font_mode*/ ctx[2])) {
				attr_dev(div0, "class", div0_class_value);
			}

			if (dirty & /*List_item_bgcolor, font_mode, menu_listsk1, content_mode*/ 172) {
				each_value_2 = /*menu_listsk1*/ ctx[7];
				validate_each_argument(each_value_2);
				validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);
				each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key, 1, ctx, each_value_2, each0_lookup, div1, destroy_block, create_each_block_2, null, get_each_context_2);
			}

			if (!current || dirty & /*is_darkmode_light*/ 2 && div2_class_value !== (div2_class_value = "border-end " + /*is_darkmode_light*/ ctx[1])) {
				attr_dev(div2, "class", div2_class_value);
			}

			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(button0, t12);
				}
			}

			if (dirty & /*is_darkmode_light, font_mode, menu_listsk1, content_mode*/ 166) {
				each_value_1 = /*menu_listsk1*/ ctx[7];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(ul, t15);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (dirty & /*font_mode, dropdown*/ 260) {
				each_value = /*dropdown*/ ctx[8];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div4, t18);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (current_block_type_1 !== (current_block_type_1 = select_block_type_1(ctx))) {
				if_block1.d(1);
				if_block1 = current_block_type_1(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(a1, null);
				}
			}

			if (!current || dirty & /*font_mode*/ 4 && a1_class_value !== (a1_class_value = "dropdown-item" + /*font_mode*/ ctx[2])) {
				attr_dev(a1, "class", a1_class_value);
			}

			if (!current || dirty & /*is_darkmode_light*/ 2 && div4_class_value !== (div4_class_value = "dropdown-menu dropdown-menu-end " + /*is_darkmode_light*/ ctx[1])) {
				attr_dev(div4, "class", div4_class_value);
			}

			if (!current || dirty & /*is_darkmode_light*/ 2 && div5_class_value !== (div5_class_value = "collapse navbar-collapse " + /*is_darkmode_light*/ ctx[1])) {
				attr_dev(div5, "class", div5_class_value);
			}

			if (!current || dirty & /*nav_bar, List_item_bgcolor*/ 24 && nav_class_value !== (nav_class_value = "navbar navbar-expand-lg " + /*nav_bar*/ ctx[4] + " " + /*List_item_bgcolor*/ ctx[3] + " border-bottom")) {
				attr_dev(nav, "class", nav_class_value);
			}

			const inner_context_changes = {};
			if (dirty & /*content_mode*/ 32) inner_context_changes.context_mode = /*content_mode*/ ctx[5];
			if (dirty & /*is_darkmode_light*/ 2) inner_context_changes.bg_mode = /*is_darkmode_light*/ ctx[1];
			if (dirty & /*font_mode*/ 4) inner_context_changes.font_mode = /*font_mode*/ ctx[2];
			inner_context.$set(inner_context_changes);

			if (!current || dirty & /*is_darkmode_light*/ 2) {
				attr_dev(body, "class", /*is_darkmode_light*/ ctx[1]);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(inner_context.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(inner_context.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(head);
			if (detaching) detach_dev(t7);
			if (detaching) detach_dev(body);

			for (let i = 0; i < each_blocks_2.length; i += 1) {
				each_blocks_2[i].d();
			}

			if_block0.d();
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			if_block1.d();
			div6_resize_listener();
			destroy_component(inner_context);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('App', slots, []);

	let menu_listsk1 = [
		{
			id: 1,
			label: "Home",
			href: "#",
			onclick: {}
		},
		{
			id: 2,
			label: "Blog",
			href: "#",
			onclick: {}
		},
		{
			id: 3,
			label: "Posts",
			href: "#",
			onclick: {}
		},
		{
			id: 4,
			label: "Contact",
			href: "#",
			onclick: {}
		},
		{
			id: 5,
			label: "Profile",
			href: "#",
			onclick: {}
		},
		{
			id: 6,
			label: "Other Site",
			href: "#",
			onclick: {}
		}
	];

	let context2 = "<h1> Welcome to Lutica's Field! <br> <br> <p1 class = 'p-2'>Here is Test Field about Svelte web blogs! ";

	//context 불러오기 구현
	let link;

	let dropdown = [
		{
			id: 1,
			label: "Action",
			href: "#",
			onclick: ""
		},
		{
			id: 2,
			label: "Other Action",
			href: "#",
			onclick: ""
		}
	];

	let navbar = [{ id: 1, label: "Home", href: "#" }];
	let is_darkmode = "bg-white";
	let is_darkmode_light = "bg-light";
	let font_mode = "";
	let List_item_bgcolor = "list-group-item-light";
	let nav_bar = "navbar-light";

	function funis_darkmode() {
		if (is_darkmode == "bg-white" || is_darkmode_light == "bg-light") {
			$$invalidate(2, font_mode = " text-white");
			$$invalidate(0, is_darkmode = "bg-black");
			$$invalidate(1, is_darkmode_light = "bg-dark");
			$$invalidate(3, List_item_bgcolor = "list-group-item-dark");
			$$invalidate(4, nav_bar = "navbar-dark");
			darkmode = true;
			console.log("be black");
		} else {
			$$invalidate(3, List_item_bgcolor = "list-group-item-light");
			$$invalidate(0, is_darkmode = "bg-white");
			$$invalidate(1, is_darkmode_light = "bg-light");
			$$invalidate(2, font_mode = "");
			$$invalidate(3, List_item_bgcolor = "list-group-item-light");
			$$invalidate(4, nav_bar = "navbar-light");
			darkmode = false;
			console.log("be white");
		}
	}

	let content_mode;
	let toggle_button;
	let darkmode;
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
	});

	const click_handler = menu => $$invalidate(5, content_mode = menu.label);
	const click_handler_1 = drop => $$invalidate(5, content_mode = drop.label);

	function div6_elementresize_handler() {
		toggle_button = this.clientWidth;
		$$invalidate(6, toggle_button);
	}

	$$self.$capture_state = () => ({
		menu_listsk1,
		context2,
		link,
		dropdown,
		navbar,
		is_darkmode,
		is_darkmode_light,
		font_mode,
		List_item_bgcolor,
		nav_bar,
		funis_darkmode,
		Inner_context: Context,
		content_mode,
		toggle_button,
		darkmode
	});

	$$self.$inject_state = $$props => {
		if ('menu_listsk1' in $$props) $$invalidate(7, menu_listsk1 = $$props.menu_listsk1);
		if ('context2' in $$props) context2 = $$props.context2;
		if ('link' in $$props) link = $$props.link;
		if ('dropdown' in $$props) $$invalidate(8, dropdown = $$props.dropdown);
		if ('navbar' in $$props) navbar = $$props.navbar;
		if ('is_darkmode' in $$props) $$invalidate(0, is_darkmode = $$props.is_darkmode);
		if ('is_darkmode_light' in $$props) $$invalidate(1, is_darkmode_light = $$props.is_darkmode_light);
		if ('font_mode' in $$props) $$invalidate(2, font_mode = $$props.font_mode);
		if ('List_item_bgcolor' in $$props) $$invalidate(3, List_item_bgcolor = $$props.List_item_bgcolor);
		if ('nav_bar' in $$props) $$invalidate(4, nav_bar = $$props.nav_bar);
		if ('content_mode' in $$props) $$invalidate(5, content_mode = $$props.content_mode);
		if ('toggle_button' in $$props) $$invalidate(6, toggle_button = $$props.toggle_button);
		if ('darkmode' in $$props) darkmode = $$props.darkmode;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		is_darkmode,
		is_darkmode_light,
		font_mode,
		List_item_bgcolor,
		nav_bar,
		content_mode,
		toggle_button,
		menu_listsk1,
		dropdown,
		funis_darkmode,
		click_handler,
		click_handler_1,
		div6_elementresize_handler
	];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment.name
		});
	}
}

var app = new App({
	target: document.body
});

module.exports = app;
//# sourceMappingURL=bundle.js.map
