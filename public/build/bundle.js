
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
function empty() {
    return text('');
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

var post=[{time:"",context:""},{time:"04 04 08:00",context:"오늘도 마작을 쳐봤다. 쳐보면서 곰곰히 생각을 해봤는데, 입원 전에 전철에서 울던 이유를 깊게 생각해보니 \"삶의 중간이다\"라는 생각이 단 한번도 없어서 그랬던 걸지도 모른다. <br>퇴원을 한다면 아마도, \"지금은 아직 삶의 중간일 뿐\"이라는 질문을 던질 수 있지 않을까..."},{time:"04 03 21:30",context:"처음에 교수님이 바뀔때를 생각해봤다. 지금들어서 보니 그때 무슨말을 했는지도 기억이 안난다. 뭔가 과거의 다른 나였을지도 모른다. 이제는 과거를 조금 놔줄때일까. <br>지금에 영향을 미친 과거는 어쩌고"},{time:"04 03 20:00",context:"가끔은 우울하다. 물속의 고요함을 다시 생각해봤다. 인생은 스펙트럼인걸 알고는 있지만, 문제는 이게 생각대로 믿어지질 않는다.<br>물속의 고요함과 평온함. 그리고 고래. 언젠가 고래 한마리가 물속에 있는 그림을 생각했었다. 아쿠아리움에 갔던 기억을 살려, 무언가 고요하고 거대한 그림이 떠오른다.<br>그림. 나는 그림그리는걸 좋아했었다. 지금도 좋아하지만, 약간 멀리하게 된 감이 없잖아 있다. 하지만 그림은, 말로는 표현못할 거대한 임팩트응 가지고 있다. 그런점이 나에게 있어서는 매력이었고, 그림도 배워봤다<br>그림그리기. 그림을 그릴때는 일단 뭘 먼저 그릴지 생각해봐야 한다. 그리고 나서 어떻게그릴지를 생각하는 것이다. 하지만 내 실력은 그 생각을 따라가지 못해 매일 끙끙대곤 했다.<br>나는 삶의 고통이 컸다. 나는 마음의 피로 그 뒤에 있는 캔버스를 채웠다. 분명 밝은 빛은 아닐것이다. 나는 어둡고 파란색을 좋아한다. 하지만 피는 붉다. 어 이게 아닌데.<br>내 마음은 그렇게 죽어만 갔다. 저번의 환각은 그 거의 죽어가던 마음의 마지막 몸부림이 아닐까 생각도 해봤다.<br>고통은 삶의 환희가 주는 선명함보다 더 어둡다. 내 뒤에 있는 그림은 내 마음의 피로 채워졌고, 환희는 그 캔버스에 보이지 않았다. <br>하지만, 어둠은 빛에 상대적인 개념이다. 생각해보면, 빛이 없다면 어둡다라는 개념이 있었을까? 나는 그래서 항상 이 말을 가슴에 새겨살았다.  <br></p1><h5> 빛이 있기에 어둠이 있다.</h5><p1>고.<br>하지만, 내 뒤에 캔버스를 보면 그런것 같지가 않다. 나는 왜이리 어두운가, 나는 왜 내가 생각하는 그림이 되지 못 한걸까. <br>주변? 주변때문일 가능성이 사실은 높다고 생각하지만, 사람은 주변이 있어서 살아간다. 하지만 나는 뭔가?<br>생각해보면, 그동안의 해결방법은 \"주변\"을 없애고 그저 깊고깊은 어둠속으로 가려한걸지도 모른다.<br>다시 생각해보자. \"빛이 있기에 어둠이 있다.\" 이말은 곧 빛으로 채우면 더더욱 선명한 그림이 될지도 모른다..만, 코로나가 내 모든 염료를 빼앗아간 것 같다. <br>모르겠다. 이제는 어떻게 채워야 하는지, 뭘로, 언제, 어디를 채울건지. 내가 답을 낼 뿐이다. "},{time:"04 03 16:00",context:"나른하다. 이제는 무기력하지는 않지만 다시 나갔을때 무기력해질지 두렵다. 생각을 해보니 내 과거를 용납하던 잊던 어떻게든 떨쳐야한다. <br>그리고 알바는 생각을 해보니 주 4일해서 하루는 연구나 재택을 하는게 좋지않을까 싶다. <br>삶에 대한 여러생각을 해봤다. 난 사회성이 그리 좋진 않구나, 사망관에 대한 사고실험 논리, 무기력함을 줄이는법, 나의 시간 갖기등. <br>살아서 힘들다. 맞다. 그걸로 무기력해지지 않으면 될뿐. <br>내 친구?중에 정말 마이페이스로 사는 친구가 있고, 다른 친구는 \"그냥 앞길만 생각하면 된다\"던 친구가 있었다. 그렇게 사는것도 방법일지도 모르겠다.<br>다음주에는 화요일까지 마지막 작업을 하고 나가려고 한다. 사실 내일 나가도 좋겠지만, 몇가지만 좀 더하고 가는것도 나쁘지 않을것 같다.<br>목표하던 블로그만들기는 성과가 꽤 있었다. 이 일을 진행한 덕분에 몇가지 기술에 있어서 괜찮은 진전을 보였다고 생각한다. 책으로 읽던 것도 꽤 재미있었고, 나만의 시간이 있으면 좋은 점을 찾은 것 같다.<br>여러모로 인생에 대한 기점일지도 모르겠다."},{time:"04 02 14:30",context:"산책을 했다. 목련꽃이 피어있었다. 하얗고 나무같지만 꽃같기도 한 그 어중간한 느낌이 좋아서 나는 목련꽃을 좋아한다. 목련, 목련의 꽃말은 고귀함과 숭고함이라고 전해진다. 그 꽃과 아름다우면서도 투박한 그 모양에 걸맞는듯한 꽃말이 아닐까.<br>목련이 피었고, 다음주에는 벚꽃이 핀다. 벚꽃이 만들어내는 때에는 나무위를 보면 아름다운 색채가 느껴지지만, 가장 예쁜때는 만개한 뒤 지기 시작할 때이다.<br>삶. 삶은 벚꽃놀이와 같아서 가장 암울한 때를 지나고 난 뒤 가장 성숙해진 때가 좋은것인가. 그때가 가장 아름다운 때인가.<br>내 삶. 목련과 같이 일에 어중간한 정체성을 가진 나는, 목련의 꽃말과 그 아름다움을 따를 마음을 가지고 있는가. 죽는다면, 목련꽃은 땅으로 내려가 썩을뿐이다. 삶의 마지막은 이와 같다. <br>끝의 내 삶. 언젠가 \"최첨단에 서있겠다\"는 마음가짐은 잊혀져왔고, 오히려 심리적으로 최첨단에 서있게 되었다. 마지막을 맞는 나의 인생은, 분명 목련을 따라서, 그 끝에도 아름다움을 잊고싶지 않다.<br>처음의 내 삶. 나는 분명 처음에는 뭔가 할줄 알았다. 하지만 잊혀져왔고, 무뎌져왔고, 무기력해져왔고, 몸에는 더이상의 활력도 없었다. \"빛이 있으라\"던 빛도, 보이지 않고 어둠속에서 살아왔다. 그 터널을 나올때까지 버티면서 <br>앞으로의 내 삶. 이제 피는 목련인지, 다 펴버린 목련인지는 알 바가 없지만, 끝은 그 꽃말을 따르길. 빛이 있길. 끝이 있길."},{time:"04 02 10:00",context:"휴학을 한게 약간은 후회가 되긴 한다. 하지만 생각해보면, 낮은 학점으로 나갈바에야 & 철도기술연구원 IPP도 못해볼 바에야 차라리 학교를 나가던지 쉬면서 일하고 상황이 나아지면 다시 학교로 오는게 저 낫겠지 싶다.<br>디자인 패턴공부도 이제 슬슬 방법론을 찾아서 하게되었고, 나도 뭔가 생각이 정리가 된다. <br>42Seoul이라는 유명한 부트캠프(?)에 La pisin이라는 과정이 있는데, 한달간 확실히 한 뒤 그 뒤에 느슨해지는 방법론을 채택했다. 생각해보면 나도 그런 방법론을 향하는게 아닐까 싶다."},{time:"04 01 21:30",context:"어느날 문득 삶에 대한 회의가 들었다. 어떤 일이었는지는 모르지만, 무슨 일이 들어서 삶을 던지고 싶었다. 삶이 뭔데 나에게 이렇게 고통스럽게 하는지 모르겠다는 생각을 한다.<br>인생, 하나의 바다와도 같고 땅과도 같으며 우주와도 같은 미지의 세계. 삶과 바다,우주는 어찌보면 하나의 흐름일지도 모른다.<br>삶이 바다라고 가정하면, 땅을 찾아 헤메던 나의 인생은 희망고문에 시달린걸지도 모른다. 이 방향으로 가면 땅이 나온다는 굳센 믿음으로 살아왔지만, 사실은 아무것도 없었던.<br>요근래 코딩이라는 새로운 길을 찾았다곤 하지만 가끔은 과거의 철도기관사와 같은 희망고문이 될까 많이 두렵다.<br>하지만 하나의 작은 섬이라도, 아마 미래에 보면 \"희망봉\"같은 섬이 될지도 모른다는 생각도 든다. 모르겠다. 아직은. 지금도 과거도 삶에 배신당한 일만 기억이 날뿐.<br>희망이 있기를."},{time:"04 01 20:00",context:"예전에 자주 듣던 음악을 들었다. 이유는 모르겠지만 힘들때마다 듣기도 하고, 고통스러울때마다, 행복할때도 들었었다.<br>그때 들었던 음악을 들으니, 과거의 내가 생각나 이유를 모을 울음을 터트렸다. 나는 내 삶을 아무도 알아 주지않던, 그리고 알아주지도 않을 세상에서 보내고 있다. 어쩔수없다.<br>나는 지금의 내가 싫고, 짜증나지만, 어떻게 살기는 할테니 미래를 개선해나가는 수 밖에 없다. 지금의 나랑 과거의 나는 다르다는점, 이것 하나는 확실해졌다.<br>과연 내가 내가 원하는 삶인지도, 왜 태어났는지도 모르지만 살겠다면 확실히 살아야지. <br><br>여름철에 바다를 가면 덥고, 물이 가장 시원하지만, 겨울철에 바다를 가면 바람이 매우 강하고 춥다. 인생의 시련이란게 그런것인가. 삶의 고통이란 그런것인가. <br>내가 좋아하던 음악 하나를 덧붙이고 싶다. 내가 가장 우울할때 자주 듣던 음악이었다. <br> </p1><center><iframe width=\"auto\" height=\"auto\" src=\"https://www.youtube.com/embed/ypM_WGTlb1U\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe></center>"},{time:"03 31 18:00",context:"휴학을 결정했다. 예전의 실수와는 다르게, 할 것도 있겠다, 적성에 맞는 길도 어느정도 생각이 났고, 하고싶은 걸 하는 목표가 있는 쉼 이기 때문에, 나는 별 가책을 느끼지 않는다. <br>사장님과 통화를 해보니 “결단을 내렸다”고 하셨다. 맞는 말인 것 같다. 삶에서 늦었는지도 다시 되돌아보면, 아직 그리 늦지는 않았을 지도 모른다는 생각이 들기 시작했다. 학습. 인간과 일부 동물들은 과거를 통해서 현재를 남기는 방법이다. <br>생각해보면, 과거에 너무 매달려 있던게 아니었을까 싶다. 그저 과거에서 배우면 될 뿐인 걸 별 생산성없이 끙끙대고 있었을지도 모르겠다. 그럼에도 마음의 한켠에는 어딘가 아프다. 이 감정은 생각하면 생각할수록 깊은 상처같이 몸을 움추리게 되고 갑자기 울고싶어진다.<br>이 감정을 구체적으로 확립하고 어떤 문제가 있는지를 알아내고 이를 처리하는 과정이 있을지도 모른다. <br>구체적으로, 글을 쓸 때마다, 어딘가의 과거를 짚을때마다, 무언가 아프다. 어딘가 무언가 서려 있을지도 모른다. 뭔지도 모를 이 감정은 어디에서 나오는건지 궁금하다. 사실 표면적으로 이해를 하고 있으면서 내면적으로는 모른다고 생각하는 걸까.<br>어제오늘 디자인패턴 책을 읽으면서 observer 패턴을 배웠는데, 환각증상은 병원에 입원한 이래로 보이지 않는 것을 생각해보면 능동적으로 알려주는 방향이 좋지 않을까 싶다. <br>마작도 치고싶고 무언가 사람들 하고도 놀고싶다. 입원 끝나면 누군가 만나야겠다.<br><rb>(7시 추가) : 이 글의 시작에 대해서 유심히 생각해봤다. 생각해보니 매일매일 유서를 쓰던 시절이 있었는데, 그 시절 쓴 경험으로 진료를 받았던 기억이 있어 그것을 따라해본 느낌인데, 꽤 괜찮은 것 같다. "},{time:"03 31 13:30",context:"진료때마다 자주 듣던 이야기로 “중간이 없다”는 말이 자주 나왔다. 삶의 중간. 혹은 과정. 삶? 과정은 항상 불행하고 불안하고 우울했다. 결과는 암울했고, 항상 과정을 생각하는 일은 우울하고 고통스러웠다. 삶에 대한 생각, 이 모든 걸 끝내고 살았을 때 받는 모든 고통의 끝을 공허로 되돌리고, 허무한 삶을 마무리짓고 삶의 ‘중간’에서의 고통을 피하기 위해 삶이 가장 행복해 질 수 있는 삶의 마지막 단계를 찾아가는 것 뿐이었다. 중간은 항상 고통스럽고, 알아주는 사람도 없었고 그냥 나 혼자서 견뎌야했다. 삶? 생존이 아무리 인간의 욕구라고는 하지만 삶의 마지막은 항상 죽음이다. 죽음, 삶의 마지막. 험난한 산을 넘을 때 가장 괜찮은 방법은, 산을 피하는 것. 내 자살에 관한 생각도 그러하다. 움직여지지도 않을바에야, 차라리 죽어서 삶의 고통이 있는 산을 건너고, 끝을 향해서 달리는 것만이 내 삶에서의 ‘최적해’일지도 모른다. 최적인 삶. 죽음으로 향하여. "},{time:"03 30 15:45",context:"삶이 뭘까. 가장 근본적인 질문이면서, 가장 짧지만, 가장 많은 의미를 담는 질문이다. 프로그래밍분야에서는 가장 간결하고 가장 효율적이면서, 가장 많은 상황에 적용할 수 있는 코드가 가장 좋x`은 코드라고들 이야기한다. 생각해보면, 이 질문 하나로 수많은 답, 철학, 작품, 종교가 나오는 것을 생각하면, 인생에 대한 가장 좋은 질문이 아닐까라는 생각이 들곤 한다. 하지만, 빛이 있으면 어둠이 항상 따라다니는 법. 삶은 많은 경우 괴롭다. 내 경험칙으로 판단해보면, 삶의 고통은 항상 행복에 비해서 깊고, 강하고, 오래갔다. 삶. 삶이 왜 있을까. 이런 고통스러운 삶을 살 바에는 차라리 태어나기 이전의 고요함속으로 돌아가는 방향이 더 행복하지 않았을까. 사실, “삶의 고통”이라는 것도 삶이라는 것도 내가 만든 관념의 일부일지도 모르지만(사실 그게 경험칙이니까), 고통만은 내가 느끼고, 삶을 재판단하는 근거이자 삶을 다시 재고하는 근거라고 생각한다. 나는 항상 방향은 알지만 움직여지지는 못하는 사람이었고, 나는 항상 움직여지지 않았다. 나는 움직여지지 않는 정신을 가지고 평가받을때마다, 나는 삶과 나의 부조화에 항상 고통받고 살았다. 이것이 지금의 나를 만들었고, 항상 움직여지지 않는 나를 보며 나는 항상 나를 싫어했다. 왜 나는 이렇게 됬을까. 나는 왜 태어났을까. 가장 근본적인 질문이지만, 가장 알기 어려운 문제일지도 모른다. 수학에서의 좋은 질문과 같은게 아닐까. 쓰다보니 마음의 어딘가가 아프다. 쓰면서 울곤 했다. 뭐가 문제지."},{time:"03 30 20:00",context:"중3 때부터 문득 든 생각이 있었다. “삶의 허무성”이라는 감정과, 그에 수반된 허무주의는 중 3때부터 나의 인생에 대한 철학이라고 생각하고 있다. 삶의 허무. 허무란 무엇인가. 무언가 행복한 상태에서 불행한 상태로 진행될 때 자주 나타나는 감정이자, 이전의 상태와 비교하면서 자주 드러나는 감정이다. 비고 없다는 말의 한자어인 이 허무는 삶에 있어서 “죽고 없어진다”는 뜻으로 받아들여왔고, 나는 가끔 이런 허무에 대한 생각이 삶으로 뻗어나가는 것을 알고 있었다. 나는 인간의 뇌 회로를 컴퓨터와 비슷한 유기적 전자회로의 일부로 치환해서 생각했다. 분명, 죽은 뒤 아무것도 없다는 생각의 기저에는 물질계에서의 인간과 정신계에서의 인간은 서로 동일하다는 생각에서 진행된 ‘사고실험’이거나 ‘회의적 추측’일 지도 모른다. 하지만 그동안의 나에게 있어서의 “패러다임”은 당연히 죽고 난 뒤에는 컴퓨터가 꺼지고 회로에 전류가 사라지는 듯한 감정, 생각, 신체적 움직임이 존재하지 않는 상태가 된다는 믿음으로 죽음을 추구했다. 오래된 현실로부터의 고통으로 벗어나기 위하여, 나는 그 믿음으로 이루진 영역에 다가가고 싶었다. 고통은 삶의 폐허를 만들어내고, 삶의 폐허는 다시 고통을 만들어내는 파괴적 체계를 가지고 삶을 살았지만, 이 파괴적 체계의 기저적 믿음은 “죽음의 행복”(과거의 고통과 비교되는)이었던 것이다. <br>삶을 하나의 땅으로 비유해보자. 내 인생은 느끼기에, 매일매일 비가 오고 폭풍우와 장마가 몰아닥치는, 악지(惡地) 의 형태요 삶의 성취와 건설을 이루기 어려운 땅이었다. 다른이들은 삶에서 무언가의 건물을 짓고 번성해 나가지만, 나는 매일매일 비가 오는 늪지대에서 생존을 이야기하기도 어려웠다. 근 3년전의 반수시절에나 약간 해가 떠서 아주 잠시 무언가를 건설했지, 그 외의 시기에는 그 폭풍우를 이겨나가는 것도 힘들었다. 이걸 세상에선 알아주지 않는다. 그저 “못한 사람, 성적이 나쁘거나 & 무언가가 나쁜 사람”이라고는 할 뿐이지만. <br>이런 생각을 하다보니 내 삶은 폐허가 되었고, 다시 폐허는 허무를, 허무는 폐허를 불러오면서 내 삶에 행복한 기억은 얼마 없다. 그저 ‘방치’된 삶에서 폐허를 헤쳐나갔을 뿐. 삶의 끝을 항상 느끼면서 삶을 끝내자는 생각만 할 뿐.<br>그래도 대학생이 되고 난 뒤에는 “최고효율주의”(소위 경제적인 이라고 하는)라고 하는 개념으로 잡아가고 있다고 하지만, 파괴적인 삶의 지향은 변하지 않고 그 괴리감에 고통을 받는건지 뭐인지는 모르겠지만, 하나는 확실하다. “패러다임”과 “현실적 해결책” 그리고 “목표(==이상향)”이 제각기 다를 뿐."},{time:"03 29 18:30",context:"수족관속에 고래가 산다고 생각해보자, 그렇다면 그 물속과 그 물속을 바라다보는 사람은 어떤 느낌을 느낄까. 물속의 밀도, 물속의 고요함과 그 속에 있는 물의 요동, 그리고 물속의 푸른빛이 느껴질 것이다. 물속의 고요함과 물속의 요동. 그 고요함은 삶에 있어서 평온을 주곤 한다. 하지만, 삶은 물속과는 다르게 평온하지 않다. 나는 가끔, 자주 “태어난 죄”에 대해서 묻는다. 나는 짓지도 않은 죄를 태어났다는 이유 하나만으로 이 죄를 지었다고 생각한다. 다시 물속의 평온으로 돌아가서, 물속의 고요함은 내가 찾는 가장 평화로운 환경이다. 항상 바다의 고요함을 찾고, 동경하고, 그 물속의 평온함을 느끼는 것. 그것은 나에게 있어서 자연이 찾고자 하는 본질과 같은 걸지도 모른다. 전기의 회로이론에서, 높은 전압에서 낮은 전압으로 전류가 흐르듯 (사실은 가정이지만), 나에게는 고요와 평온을 찾고자 하는 것일지도 모른다. 그러나 삶은 “태어난 죄”를 이야기하고 싶을 만큼, 격렬하고 요동친다. 태어난 죄, 나는 태어나고 싶지 않았다. 나는 죽음에서 물속에 있는 듯한 고요를 찾고 싶다. 공허속에서 차라리, 아무것도 하지 않아도 아무 생각도 없어서 아무런 감정도 고통도 없는 세상에서 살고 싶다고 매일매일 묻고 생각하고 산다. 그리고 삶의 폭풍이 강하게 들이닥치면, 나의 실책을 생각하면서 그 고요속으로 돌아가고 싶다는 생각은 항상 강해져 온다. 그것이 나의 ‘원점’이니까. <br>나는 어떤 이야기를 해도 주변에서 아무도 들어주지 않고, 딱히 특출난 재능도 없어서 사람들에게 자주 잊혀지는 존재다. 나는 내 삶이 항상 공허로 가득 차있고, 결국은 돌아갈 공허로 항상 돌아가고 싶은 마음이 있다. 고요함을 느끼는 건 항상 나에게 안정을 준다. 그 고요함속으로 들어가. 내 이 고통을 끝내고 감정이 있고 삶이 있음으로써 느끼는 고통을 항상 끝내고 싶었다. 나는 유년기때 뭔가를 해내지 못했거나 않았고, 현실을 생각하지 않고 나만의 노선을 생각했던 과거를 후회하면서, 이 모든걸 되돌리고 고통을 끝내기 위해서, 수족관속에 고래가 있는 물 속의 평온함으로 돌아가고 싶을 뿐이었을지도 모른다.<br>학교는 생각해보니 때려치고 학점은행제로 바꿔서 커리어를 쌓는 것도 괜찮아보인다. 대충 첫 취직도 했고, 코딩이 재밌다는 걸 깨닫긴 했고, 사실 이 학교 학사학위를 따도 별 감흥이 없기도 하니, 그냥 일을 하는게 나을지도 모르겠다."},{time:"03 28 21:30",context:"나는 제어공학시간과 회로이론 시간 떄 배웠던 statement라는 개념을 좋아한다. 수식으로 상태를 나타낼 수 있고, 다른 statement로 움직이는 것을 제어할 수 있다는 개념이 머리속에 와 닿았기 때문이다. 하지만 나는 그런 statement를 만들어낼 수 있을까? 내인생은 가장 혈기왕성해야 할 떄는 무기력으로, 방치로 누워만 있었고, feedback을 만들지 못하는 open-loop system에, 효율도 낮은 system이라는 생각을 해야했다. 하지만 해내지못했다. 내 옆에는 아무도 없었고, 도와주는 체계도 갖추지 못했다. 알고는 있다. 지금 후회해봤자 늦었다는걸. 내가 움직이지 않았다는 걸.<br>언젠가 내가 “인생의 답을 찾았다”고 한 적이 있었다. 생각해보자. 우리는 모두 죽는다. 그저 죽음의 고통이라는 ‘고통의’ 문턱효과가 최종적인 statement에 도달하는 걸 막을 뿐. 죽음. 우리는 모두 죽음 앞에 평등하다. 삶은 고통스럽고, 인생은 잔인하고, 나는 삶의 허무성에 대해서 생각했다. 삶은 허무하다. 죽음 앞에 평등하고, 인생의 끝은 결국 죽음뿐이다. <br>내가 죽는다는 건, 인생의 끝을 그저 빨리 보고자 함이고, 내 모든 인생의 실패의 결과를 내가 고스란히 안고 이 모든 결과를 0에 수렴시킬 수 있는, 유일한 방법이다. 환각의 손. 손은 그 길을 안내하는 길이었을 지도 모르겠다. 내 옆에서 빛을 발하고 있던 그 손은 이 모든 여정의, 고통의 끝일뿐일지도, 고통을 끝낼 마지막 길일지도 모른다. <br>분명, 이런 모든 걸 잊고 무언가에 몰두한다. 그 무언가가 요즘은 웹사이트 개발이지만. 하지만 다시 삶을 돌아보면, 나에게는 죽음만이 최종적인 행복을 보장하는 길이라는 생각은 자주 들 뿐이다. 마지막. 마지막. 마지막. 고통의 길. 이제는 싫다. 나는 하루가 마다하고 하고 싶은게 많았다.공부도 해야한다는걸 알고있지만, 어떻게 하는지도, 뭘로 하는지도 누군가는 알려줬지만 나는 그걸 할 기력을 잃고 살았다. 이 모든 탈력의 결과는 죽음으로서 해결될 지도 모른다.<br>잠이 오질 않는다. 글을 쓰다보니 눈물이 나온다. 왜지. "},{time:"",context:""}];var postsk$1 = {post:post};

/* src\post_list\depressContest.svelte generated by Svelte v3.46.4 */
const file$4 = "src\\post_list\\depressContest.svelte";

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[2] = list[i];
	return child_ctx;
}

// (9:0) {#each postsk['post'] as Ddairy}
function create_each_block$3(ctx) {
	let hr;
	let t0;
	let center;
	let h3;
	let t1_value = /*Ddairy*/ ctx[2]['time'] + "";
	let t1;
	let t2;
	let p1;
	let raw_value = /*Ddairy*/ ctx[2]['context'] + "";
	let t3;
	let br;

	const block = {
		c: function create() {
			hr = element("hr");
			t0 = space();
			center = element("center");
			h3 = element("h3");
			t1 = text(t1_value);
			t2 = space();
			p1 = element("p1");
			t3 = space();
			br = element("br");
			add_location(hr, file$4, 9, 0, 183);
			add_location(h3, file$4, 11, 4, 203);
			add_location(center, file$4, 10, 0, 189);
			add_location(p1, file$4, 13, 0, 242);
			add_location(br, file$4, 14, 0, 278);
		},
		m: function mount(target, anchor) {
			insert_dev(target, hr, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, center, anchor);
			append_dev(center, h3);
			append_dev(h3, t1);
			insert_dev(target, t2, anchor);
			insert_dev(target, p1, anchor);
			p1.innerHTML = raw_value;
			insert_dev(target, t3, anchor);
			insert_dev(target, br, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(hr);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(center);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(p1);
			if (detaching) detach_dev(t3);
			if (detaching) detach_dev(br);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$3.name,
		type: "each",
		source: "(9:0) {#each postsk['post'] as Ddairy}",
		ctx
	});

	return block;
}

function create_fragment$4(ctx) {
	let head;
	let t;
	let body;
	let body_class_value;
	let each_value = postsk$1['post'];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			head = element("head");
			t = space();
			body = element("body");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			add_location(head, file$4, 5, 0, 98);
			attr_dev(body, "class", body_class_value = /*darkmode*/ ctx[0] + /*fontmode*/ ctx[1]);
			add_location(body, file$4, 7, 0, 115);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, head, anchor);
			insert_dev(target, t, anchor);
			insert_dev(target, body, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(body, null);
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*postsk*/ 0) {
				each_value = postsk$1['post'];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(body, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*darkmode, fontmode*/ 3 && body_class_value !== (body_class_value = /*darkmode*/ ctx[0] + /*fontmode*/ ctx[1])) {
				attr_dev(body, "class", body_class_value);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(head);
			if (detaching) detach_dev(t);
			if (detaching) detach_dev(body);
			destroy_each(each_blocks, detaching);
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

	$$self.$capture_state = () => ({ darkmode, fontmode, postsk: postsk$1 });

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
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { darkmode: 0, fontmode: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DepressContest",
			options,
			id: create_fragment$4.name
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

var post_nomal=[{title:"",context:""},{title:"세상",context:"<center><p1>삶이란 무엇일까. 가끔은 허무하기도 하고, 황망하기도 하고, 아무것도 아닌것 처럼 느껴진다. <br>하지만 지금이 있으면 된 것 이다. 지금이 행복하면 삶이 행복한거고, 미래도 행복할 것이다.<br>탐욕법, \"지금의 최선의 해가 나중에도 최선에 가까운 해가 된다.\"는 이 알고리즘은 어찌보면 인생의 진리가 아닐까.<br>나는 깊은 허무감에 찌들어 살았지만, 생각을 바꾸어보면 또 다를지도 모른다. 내가 보는만큼 세상이 보이는 것이다. <br>분명 나는 허무감을 항상 가슴에 품고있지만서도, 어딘가를 향한 열정을 가지고 있다. 달려보자, 나를 위해. </p1></center>"}];var post_tech=[{title:"project android-window controller",context:"프로젝트 개요 : 안드로이드 스마트폰의 음량 통제기능을 통하여 윈도우 컴퓨터의 사운드(추가 : 밝기)를 통제하는 App를 만든다. <br>중간 통신 방안 : bluetooth를 사용하여 시리얼 통신으로 한다<br>작용 기전 : <br>1. Android 혹은 ios cellphone으로 음량버튼을 누른다<br>2. 백그라운드에서 가동중인 cellphone 측 App가 bluetooth를 통해 연결된 window 컴퓨터를 조작하라는 명령을 내린다<br>3. Window측 app가 이 명령을 백그라운드에서 수신하고, 소리를 줄인다.<br><br> 선결조건 : C#개발이므로, Nuget을 잘 찾을 필요가 있음. 컴퓨터측 APP와 cellphone측 APP는 서로 다른 프로젝트로 생성<br> 고려사안 : 보안을 위한 암호화, bluetooth의 통신 방안."},{title:"code convention",context:"Coding conventions are a set of guidelines for a specific programming language that recommend programming style, practices, and methods for each aspect of a program written in that language.<br> code convention  : 프로그램 작성시에 추천되는 스타일, 관습, 그리고 문법상에서의 각각의 요소를 의미한다. <br>naming convention : 가독성을 좋게 하기위하여, 변수명을 naming할때 쓰는 규칙, 카멜, 파스칼 케이스 등이 있다.<br>"},{title:"",context:""}];var postsk = {post_nomal:post_nomal,post_tech:post_tech};

/* src\post_list\nomallt.svelte generated by Svelte v3.46.4 */
const file$3 = "src\\post_list\\nomallt.svelte";

function get_each_context_1$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i];
	return child_ctx;
}

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i];
	return child_ctx;
}

// (28:22) 
function create_if_block_2$2(ctx) {
	const block = { c: noop, m: noop, p: noop, d: noop };

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$2.name,
		type: "if",
		source: "(28:22) ",
		ctx
	});

	return block;
}

// (20:24) 
function create_if_block_1$3(ctx) {
	let each_1_anchor;
	let each_value_1 = postsk['post_tech'];
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*postsk*/ 0) {
				each_value_1 = postsk['post_tech'];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$3.name,
		type: "if",
		source: "(20:24) ",
		ctx
	});

	return block;
}

// (11:4) {#if code == 1}
function create_if_block$3(ctx) {
	let each_1_anchor;
	let each_value = postsk['post_nomal'];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*postsk*/ 0) {
				each_value = postsk['post_nomal'];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(11:4) {#if code == 1}",
		ctx
	});

	return block;
}

// (21:4) {#each postsk['post_tech'] as post}
function create_each_block_1$2(ctx) {
	let center;
	let strong;
	let h3;
	let t0_value = /*post*/ ctx[3]['title'] + "";
	let t0;
	let t1;
	let p1;
	let raw_value = /*post*/ ctx[3]['context'] + "";
	let t2;
	let hr;

	const block = {
		c: function create() {
			center = element("center");
			strong = element("strong");
			h3 = element("h3");
			t0 = text(t0_value);
			t1 = space();
			p1 = element("p1");
			t2 = space();
			hr = element("hr");
			add_location(h3, file$3, 22, 16, 531);
			add_location(strong, file$3, 22, 8, 523);
			add_location(center, file$3, 21, 4, 505);
			add_location(p1, file$3, 24, 4, 587);
			add_location(hr, file$3, 25, 4, 627);
		},
		m: function mount(target, anchor) {
			insert_dev(target, center, anchor);
			append_dev(center, strong);
			append_dev(strong, h3);
			append_dev(h3, t0);
			insert_dev(target, t1, anchor);
			insert_dev(target, p1, anchor);
			p1.innerHTML = raw_value;
			insert_dev(target, t2, anchor);
			insert_dev(target, hr, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(center);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(p1);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(hr);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$2.name,
		type: "each",
		source: "(21:4) {#each postsk['post_tech'] as post}",
		ctx
	});

	return block;
}

// (12:4) {#each postsk['post_nomal'] as post}
function create_each_block$2(ctx) {
	let center;
	let strong;
	let h3;
	let t0_value = /*post*/ ctx[3]['title'] + "";
	let t0;
	let t1;
	let p1;
	let raw_value = /*post*/ ctx[3]['context'] + "";
	let t2;
	let hr;

	const block = {
		c: function create() {
			center = element("center");
			strong = element("strong");
			h3 = element("h3");
			t0 = text(t0_value);
			t1 = space();
			p1 = element("p1");
			t2 = space();
			hr = element("hr");
			add_location(h3, file$3, 14, 16, 307);
			add_location(strong, file$3, 14, 7, 298);
			add_location(center, file$3, 13, 4, 281);
			add_location(p1, file$3, 16, 8, 371);
			add_location(hr, file$3, 17, 8, 415);
		},
		m: function mount(target, anchor) {
			insert_dev(target, center, anchor);
			append_dev(center, strong);
			append_dev(strong, h3);
			append_dev(h3, t0);
			insert_dev(target, t1, anchor);
			insert_dev(target, p1, anchor);
			p1.innerHTML = raw_value;
			insert_dev(target, t2, anchor);
			insert_dev(target, hr, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(center);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(p1);
			if (detaching) detach_dev(t2);
			if (detaching) detach_dev(hr);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(12:4) {#each postsk['post_nomal'] as post}",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let head;
	let t0;
	let body;
	let hr;
	let t1;
	let body_class_value;

	function select_block_type(ctx, dirty) {
		if (/*code*/ ctx[2] == 1) return create_if_block$3;
		if (/*code*/ ctx[2] == 2) return create_if_block_1$3;
		if (/*code*/ ctx[2] == 3) return create_if_block_2$2;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type && current_block_type(ctx);

	const block = {
		c: function create() {
			head = element("head");
			t0 = space();
			body = element("body");
			hr = element("hr");
			t1 = space();
			if (if_block) if_block.c();
			add_location(head, file$3, 6, 4, 143);
			add_location(hr, file$3, 9, 4, 206);
			attr_dev(body, "class", body_class_value = /*darkmode*/ ctx[0] + /*fontmode*/ ctx[1]);
			add_location(body, file$3, 8, 4, 168);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, head, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, body, anchor);
			append_dev(body, hr);
			append_dev(body, t1);
			if (if_block) if_block.m(body, null);
		},
		p: function update(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if (if_block) if_block.d(1);
				if_block = current_block_type && current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(body, null);
				}
			}

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

			if (if_block) {
				if_block.d();
			}
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
	validate_slots('Nomallt', slots, []);
	let { darkmode } = $$props;
	let { fontmode } = $$props;
	let { code } = $$props;
	const writable_props = ['darkmode', 'fontmode', 'code'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nomallt> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ('darkmode' in $$props) $$invalidate(0, darkmode = $$props.darkmode);
		if ('fontmode' in $$props) $$invalidate(1, fontmode = $$props.fontmode);
		if ('code' in $$props) $$invalidate(2, code = $$props.code);
	};

	$$self.$capture_state = () => ({ postsk, darkmode, fontmode, code });

	$$self.$inject_state = $$props => {
		if ('darkmode' in $$props) $$invalidate(0, darkmode = $$props.darkmode);
		if ('fontmode' in $$props) $$invalidate(1, fontmode = $$props.fontmode);
		if ('code' in $$props) $$invalidate(2, code = $$props.code);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [darkmode, fontmode, code];
}

class Nomallt extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { darkmode: 0, fontmode: 1, code: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Nomallt",
			options,
			id: create_fragment$3.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*darkmode*/ ctx[0] === undefined && !('darkmode' in props)) {
			console.warn("<Nomallt> was created without expected prop 'darkmode'");
		}

		if (/*fontmode*/ ctx[1] === undefined && !('fontmode' in props)) {
			console.warn("<Nomallt> was created without expected prop 'fontmode'");
		}

		if (/*code*/ ctx[2] === undefined && !('code' in props)) {
			console.warn("<Nomallt> was created without expected prop 'code'");
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

	get code() {
		throw new Error("<Nomallt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set code(value) {
		throw new Error("<Nomallt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src\post_list\something2.svelte generated by Svelte v3.46.4 */
const file$2 = "src\\post_list\\something2.svelte";

// (26:22) 
function create_if_block_1$2(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block_2$1, create_else_block$2];
	const if_blocks = [];

	function select_block_type_1(ctx, dirty) {
		if (/*caption*/ ctx[3] == true) return 0;
		return 1;
	}

	current_block_type_index = select_block_type_1(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type_1(ctx);

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
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
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
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$2.name,
		type: "if",
		source: "(26:22) ",
		ctx
	});

	return block;
}

// (19:0) {#if code >=1}
function create_if_block$2(ctx) {
	let div;
	let nomal;
	let current;

	nomal = new Nomallt({
			props: {
				darkmode: /*darkmode*/ ctx[1],
				fontmode: /*font_mode*/ ctx[2],
				code: /*code*/ ctx[0]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(nomal.$$.fragment);
			add_location(div, file$2, 19, 0, 371);
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
			if (dirty & /*code*/ 1) nomal_changes.code = /*code*/ ctx[0];
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
		id: create_if_block$2.name,
		type: "if",
		source: "(19:0) {#if code >=1}",
		ctx
	});

	return block;
}

// (33:0) {:else}
function create_else_block$2(ctx) {
	let center;
	let h2;
	let br0;
	let t1;
	let p1;
	let br1;
	let t3;
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			center = element("center");
			h2 = element("h2");
			h2.textContent = "경고 : 우울한 내용 다수 포함되어있음 , 필요한 경우만 사용 ";
			br0 = element("br");
			t1 = space();
			p1 = element("p1");
			p1.textContent = "기록 보존용임 ";
			br1 = element("br");
			t3 = space();
			button = element("button");
			button.textContent = "확인";
			add_location(h2, file$2, 34, 0, 630);
			add_location(br0, file$2, 34, 45, 675);
			add_location(p1, file$2, 35, 0, 681);
			add_location(br1, file$2, 35, 18, 699);
			attr_dev(button, "class", "btn btn-primary");
			add_location(button, file$2, 36, 0, 705);
			add_location(center, file$2, 33, 0, 620);
		},
		m: function mount(target, anchor) {
			insert_dev(target, center, anchor);
			append_dev(center, h2);
			append_dev(center, br0);
			append_dev(center, t1);
			append_dev(center, p1);
			append_dev(center, br1);
			append_dev(center, t3);
			append_dev(center, button);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
				mounted = true;
			}
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(center);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$2.name,
		type: "else",
		source: "(33:0) {:else}",
		ctx
	});

	return block;
}

// (27:0) {#if caption == true }
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
			add_location(div, file$2, 27, 0, 522);
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
		source: "(27:0) {#if caption == true }",
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
	const if_block_creators = [create_if_block$2, create_if_block_1$2];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*code*/ ctx[0] >= 1) return 0;
		if (/*code*/ ctx[0] == -1.12) return 1;
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
			add_location(head, file$2, 14, 0, 300);
			attr_dev(body, "class", body_class_value = "" + (null_to_empty(/*darkmode*/ ctx[1] + /*font_mode*/ ctx[2]) + " svelte-1hzu1u5"));
			add_location(body, file$2, 17, 0, 319);
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
	let caption = false;
	const writable_props = ['code', 'darkmode', 'font_mode', 'link_of_post'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Something2> was created with unknown prop '${key}'`);
	});

	const click_handler = function () {
		$$invalidate(3, caption = true);
	};

	$$self.$$set = $$props => {
		if ('code' in $$props) $$invalidate(0, code = $$props.code);
		if ('darkmode' in $$props) $$invalidate(1, darkmode = $$props.darkmode);
		if ('font_mode' in $$props) $$invalidate(2, font_mode = $$props.font_mode);
		if ('link_of_post' in $$props) $$invalidate(4, link_of_post = $$props.link_of_post);
	};

	$$self.$capture_state = () => ({
		code,
		darkmode,
		font_mode,
		Depressful: DepressContest,
		link_of_post,
		Nomal: Nomallt,
		caption
	});

	$$self.$inject_state = $$props => {
		if ('code' in $$props) $$invalidate(0, code = $$props.code);
		if ('darkmode' in $$props) $$invalidate(1, darkmode = $$props.darkmode);
		if ('font_mode' in $$props) $$invalidate(2, font_mode = $$props.font_mode);
		if ('link_of_post' in $$props) $$invalidate(4, link_of_post = $$props.link_of_post);
		if ('caption' in $$props) $$invalidate(3, caption = $$props.caption);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [code, darkmode, font_mode, caption, link_of_post, click_handler];
}

class Something2 extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			code: 0,
			darkmode: 1,
			font_mode: 2,
			link_of_post: 4
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

		if (/*link_of_post*/ ctx[4] === undefined && !('link_of_post' in props)) {
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

function get_each_context_1$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[15] = list[i];
	return child_ctx;
}

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[12] = list[i];
	return child_ctx;
}

// (103:12) {:else}
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
			p1.textContent = "Welcome! , Buildeing in progress";
			add_location(br, file$1, 103, 18, 3932);
			add_location(p1, file$1, 105, 16, 3980);
			add_location(center, file$1, 104, 16, 3954);
			add_location(div, file$1, 103, 12, 3926);
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
		source: "(103:12) {:else}",
		ctx
	});

	return block;
}

// (88:45) 
function create_if_block_3(ctx) {
	let div;
	let center;
	let br0;
	let h1;
	let t0;
	let br1;
	let br2;
	let t1;
	let t2;
	let page1;
	let current;
	let each_value_1 = /*code_list*/ ctx[5];
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
	}

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

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			create_component(page1.$$.fragment);
			add_location(br0, file$1, 90, 16, 3441);
			add_location(br1, file$1, 90, 31, 3456);
			add_location(h1, file$1, 90, 20, 3445);
			add_location(br2, file$1, 90, 40, 3465);
			add_location(center, file$1, 89, 12, 3415);
			add_location(div, file$1, 88, 12, 3396);
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

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(center, null);
			}

			append_dev(div, t2);
			mount_component(page1, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*code_on, code_book, code_list*/ 104) {
				each_value_1 = /*code_list*/ ctx[5];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(center, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
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
			destroy_each(each_blocks, detaching);
			destroy_component(page1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3.name,
		type: "if",
		source: "(88:45) ",
		ctx
	});

	return block;
}

// (73:46) 
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
			add_location(br0, file$1, 75, 20, 2856);
			add_location(h2, file$1, 76, 20, 2882);
			add_location(br1, file$1, 77, 20, 2927);
			attr_dev(img, "width", "50%");
			attr_dev(img, "height", "50%");
			if (!src_url_equal(img.src, img_src_value = "../src/KakaoTalk_20220322_200232462.png")) attr_dev(img, "src", img_src_value);
			add_location(img, file$1, 78, 20, 2953);
			add_location(br2, file$1, 79, 20, 3056);
			add_location(hr0, file$1, 80, 20, 3082);
			add_location(br3, file$1, 82, 58, 3187);
			add_location(br4, file$1, 82, 90, 3219);
			add_location(br5, file$1, 82, 120, 3249);
			add_location(hr1, file$1, 82, 124, 3253);
			attr_dev(p1, "class", "p-1");
			add_location(p1, file$1, 81, 20, 3108);
			add_location(center, file$1, 74, 16, 2826);
			add_location(div, file$1, 73, 12, 2803);
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
		source: "(73:46) ",
		ctx
	});

	return block;
}

// (62:46) 
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

			add_location(h3, file$1, 64, 20, 2402);
			attr_dev(ul, "class", "ul");
			add_location(ul, file$1, 65, 20, 2460);
			add_location(center, file$1, 63, 16, 2372);
			add_location(div, file$1, 62, 12, 2349);
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
		source: "(62:46) ",
		ctx
	});

	return block;
}

// (55:12) {#if context_mode == "Home"}
function create_if_block$1(ctx) {
	let center;
	let div;
	let br0;
	let t0;
	let b;
	let h1;
	let br1;
	let t2;
	let br2;
	let p10;
	let t4;
	let br3;
	let p11;
	let t5;
	let a;

	const block = {
		c: function create() {
			center = element("center");
			div = element("div");
			br0 = element("br");
			t0 = space();
			b = element("b");
			h1 = element("h1");
			h1.textContent = "Welcome to my field!";
			br1 = element("br");
			t2 = space();
			br2 = element("br");
			p10 = element("p1");
			p10.textContent = "Here is my playground for learning svelte! a static blog, by GitHub.io";
			t4 = space();
			br3 = element("br");
			p11 = element("p1");
			t5 = text("I used ");
			a = element("a");
			a.textContent = "this template";
			add_location(br0, file$1, 56, 17, 1975);
			add_location(h1, file$1, 57, 19, 2000);
			add_location(b, file$1, 57, 16, 1997);
			add_location(br1, file$1, 57, 53, 2034);
			add_location(br2, file$1, 58, 16, 2056);
			add_location(p10, file$1, 58, 20, 2060);
			add_location(br3, file$1, 59, 16, 2157);
			attr_dev(a, "href", "https://startbootstrap.com/template/simple-sidebar");
			add_location(a, file$1, 59, 32, 2173);
			add_location(p11, file$1, 59, 20, 2161);
			add_location(div, file$1, 56, 12, 1970);
			add_location(center, file$1, 55, 12, 1948);
		},
		m: function mount(target, anchor) {
			insert_dev(target, center, anchor);
			append_dev(center, div);
			append_dev(div, br0);
			append_dev(div, t0);
			append_dev(div, b);
			append_dev(b, h1);
			append_dev(div, br1);
			append_dev(div, t2);
			append_dev(div, br2);
			append_dev(div, p10);
			append_dev(div, t4);
			append_dev(div, br3);
			append_dev(div, p11);
			append_dev(p11, t5);
			append_dev(p11, a);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(center);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(55:12) {#if context_mode == \\\"Home\\\"}",
		ctx
	});

	return block;
}

// (92:16) {#each code_list as codenate}
function create_each_block_1$1(ctx) {
	let button;
	let t_value = /*codenate*/ ctx[15] + "";
	let t;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[9](/*codenate*/ ctx[15]);
	}

	const block = {
		c: function create() {
			button = element("button");
			t = text(t_value);
			attr_dev(button, "id", "change_button");
			attr_dev(button, "type", "button");
			attr_dev(button, "class", "btn btn-outline-primary");
			attr_dev(button, "href", "#");
			add_location(button, file$1, 92, 16, 3534);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);
			append_dev(button, t);

			if (!mounted) {
				dispose = listen_dev(button, "click", click_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$1.name,
		type: "each",
		source: "(92:16) {#each code_list as codenate}",
		ctx
	});

	return block;
}

// (67:20) {#each SNSs as SNSone}
function create_each_block$1(ctx) {
	let il;
	let a;
	let p1;
	let t0_value = /*SNSone*/ ctx[12].SNS_name + "";
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
			add_location(p1, file$1, 67, 61, 2582);
			attr_dev(a, "href", /*SNSone*/ ctx[12].href);
			add_location(a, file$1, 67, 37, 2558);
			attr_dev(il, "class", "il");
			add_location(il, file$1, 67, 20, 2541);
			add_location(br, file$1, 67, 109, 2630);
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
		source: "(67:20) {#each SNSs as SNSone}",
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
			add_location(style, file$1, 31, 4, 1140);
			attr_dev(meta0, "charset", "utf-8");
			add_location(meta0, file$1, 41, 4, 1341);
			attr_dev(meta1, "name", "viewport");
			attr_dev(meta1, "content", "width=device-width, initial-scale=1, shrink-to-fit=no");
			add_location(meta1, file$1, 42, 4, 1371);
			attr_dev(meta2, "name", "description");
			attr_dev(meta2, "content", "");
			add_location(meta2, file$1, 43, 4, 1465);
			attr_dev(meta3, "name", "author");
			attr_dev(meta3, "content", "");
			add_location(meta3, file$1, 44, 4, 1509);
			add_location(title, file$1, 45, 4, 1548);
			attr_dev(link0, "rel", "icon");
			attr_dev(link0, "type", "image/x-icon");
			attr_dev(link0, "href", "assets/favicon.ico");
			add_location(link0, file$1, 47, 4, 1631);
			attr_dev(link1, "href", "../build/styles.css");
			attr_dev(link1, "rel", "stylesheet");
			add_location(link1, file$1, 49, 4, 1751);
			add_location(head, file$1, 30, 0, 1128);
			add_location(div0, file$1, 53, 8, 1887);
			attr_dev(div1, "id", "all_wrap");
			add_location(div1, file$1, 52, 4, 1854);
			attr_dev(body, "class", body_class_value = "" + (null_to_empty(/*bg_mode*/ ctx[1] + /*font_mode*/ ctx[2]) + " svelte-vnh244"));
			add_location(body, file$1, 51, 0, 1813);
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
	let { context_mode = "Home" } = $$props;
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
	const code_list = ["nomal post", "tech post", "test post"];

	const code_book = {
		"nomal post": 1,
		"tech post": 2,
		"test post": 3
	};

	const writable_props = ['context_mode', 'bg_mode', 'font_mode', 'size_all', 'size_bar'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Context> was created with unknown prop '${key}'`);
	});

	const click_handler = codenate => $$invalidate(3, code_on = code_book[codenate]);

	$$self.$$set = $$props => {
		if ('context_mode' in $$props) $$invalidate(0, context_mode = $$props.context_mode);
		if ('bg_mode' in $$props) $$invalidate(1, bg_mode = $$props.bg_mode);
		if ('font_mode' in $$props) $$invalidate(2, font_mode = $$props.font_mode);
		if ('size_all' in $$props) $$invalidate(7, size_all = $$props.size_all);
		if ('size_bar' in $$props) $$invalidate(8, size_bar = $$props.size_bar);
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
		code_on,
		code_list,
		code_book
	});

	$$self.$inject_state = $$props => {
		if ('context_mode' in $$props) $$invalidate(0, context_mode = $$props.context_mode);
		if ('bg_mode' in $$props) $$invalidate(1, bg_mode = $$props.bg_mode);
		if ('font_mode' in $$props) $$invalidate(2, font_mode = $$props.font_mode);
		if ('size_all' in $$props) $$invalidate(7, size_all = $$props.size_all);
		if ('size_bar' in $$props) $$invalidate(8, size_bar = $$props.size_bar);
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
		code_list,
		code_book,
		size_all,
		size_bar,
		click_handler
	];
}

class Context extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
			context_mode: 0,
			bg_mode: 1,
			font_mode: 2,
			size_all: 7,
			size_bar: 8
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Context",
			options,
			id: create_fragment$1.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*bg_mode*/ ctx[1] === undefined && !('bg_mode' in props)) {
			console.warn("<Context> was created without expected prop 'bg_mode'");
		}

		if (/*font_mode*/ ctx[2] === undefined && !('font_mode' in props)) {
			console.warn("<Context> was created without expected prop 'font_mode'");
		}

		if (/*size_all*/ ctx[7] === undefined && !('size_all' in props)) {
			console.warn("<Context> was created without expected prop 'size_all'");
		}

		if (/*size_bar*/ ctx[8] === undefined && !('size_bar' in props)) {
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
