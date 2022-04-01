
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
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
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
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

    /* src\App.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    // (63:20) {#each menu_listsk1 as menu (menu.id) }
    function create_each_block_1(key_1, ctx) {
    	let il;
    	let a;
    	let t_value = /*menu*/ ctx[14].label + "";
    	let t;
    	let a_class_value;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			il = element("il");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", a_class_value = "list-group-item list-group-item-action " + /*List_item_bgcolor*/ ctx[2] + /*font_mode*/ ctx[1] + " p-3");
    			attr_dev(a, "href", /*menu*/ ctx[14].href);
    			add_location(a, file, 63, 28, 3129);
    			add_location(il, file, 63, 24, 3125);
    			this.first = il;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, il, anchor);
    			append_dev(il, a);
    			append_dev(a, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*List_item_bgcolor, font_mode*/ 6 && a_class_value !== (a_class_value = "list-group-item list-group-item-action " + /*List_item_bgcolor*/ ctx[2] + /*font_mode*/ ctx[1] + " p-3")) {
    				attr_dev(a, "class", a_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(il);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(63:20) {#each menu_listsk1 as menu (menu.id) }",
    		ctx
    	});

    	return block;
    }

    // (82:40) {#each dropdown as drop}
    function create_each_block(ctx) {
    	let a;
    	let t_value = /*drop*/ ctx[11].label + "";
    	let t;
    	let a_class_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", a_class_value = "dropdown-item" + /*font_mode*/ ctx[1]);
    			attr_dev(a, "href", /*drop*/ ctx[11].href);
    			add_location(a, file, 82, 40, 4897);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*font_mode*/ 2 && a_class_value !== (a_class_value = "dropdown-item" + /*font_mode*/ ctx[1])) {
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
    		source: "(82:40) {#each dropdown as drop}",
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
    	let each_blocks_1 = [];
    	let each0_lookup = new Map();
    	let div2_class_value;
    	let t10;
    	let div8;
    	let nav;
    	let div6;
    	let button0;
    	let t12;
    	let button1;
    	let span;
    	let t13;
    	let div5;
    	let ul;
    	let li0;
    	let a0;
    	let li0_class_value;
    	let t15;
    	let li1;
    	let a1;
    	let t17;
    	let li2;
    	let a2;
    	let t19;
    	let div4;
    	let t20;
    	let div3;
    	let t21;
    	let a3;
    	let t22;
    	let a3_class_value;
    	let div4_class_value;
    	let div5_class_value;
    	let nav_class_value;
    	let t23;
    	let div7;
    	let t24;
    	let script;
    	let script_src_value;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*menu_listsk1*/ ctx[4];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*menu*/ ctx[14].id;
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_1[i] = create_each_block_1(key, child_ctx));
    	}

    	let each_value = /*dropdown*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

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

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t10 = space();
    			div8 = element("div");
    			nav = element("nav");
    			div6 = element("div");
    			button0 = element("button");
    			button0.textContent = "Toggle Menu";
    			t12 = space();
    			button1 = element("button");
    			span = element("span");
    			t13 = space();
    			div5 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t15 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Link";
    			t17 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Dropdown";
    			t19 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t20 = space();
    			div3 = element("div");
    			t21 = space();
    			a3 = element("a");
    			t22 = text("Change to Darkmode");
    			t23 = space();
    			div7 = element("div");
    			t24 = space();
    			script = element("script");
    			attr_dev(meta0, "charset", "utf-8");
    			add_location(meta0, file, 46, 8, 2190);
    			attr_dev(meta1, "name", "viewport");
    			attr_dev(meta1, "content", "width=device-width, initial-scale=1, shrink-to-fit=no");
    			add_location(meta1, file, 47, 8, 2223);
    			attr_dev(meta2, "name", "description");
    			attr_dev(meta2, "content", "");
    			add_location(meta2, file, 48, 8, 2320);
    			attr_dev(meta3, "name", "author");
    			attr_dev(meta3, "content", "");
    			add_location(meta3, file, 49, 8, 2367);
    			add_location(title, file, 50, 8, 2409);
    			attr_dev(link0, "rel", "icon");
    			attr_dev(link0, "type", "image/x-icon");
    			attr_dev(link0, "href", "assets/favicon.ico");
    			add_location(link0, file, 52, 8, 2498);
    			attr_dev(link1, "href", "../build/styles.css");
    			attr_dev(link1, "rel", "stylesheet");
    			add_location(link1, file, 54, 8, 2624);
    			add_location(head, file, 45, 4, 2175);
    			attr_dev(div0, "class", div0_class_value = "sidebar-heading border-bottom" + /*is_darkmode_light*/ ctx[0] + /*font_mode*/ ctx[1]);
    			add_location(div0, file, 60, 15, 2889);
    			attr_dev(div1, "class", "list-group list-group-flush");
    			add_location(div1, file, 61, 16, 2999);
    			attr_dev(div2, "class", div2_class_value = "border-end " + /*is_darkmode_light*/ ctx[0]);
    			attr_dev(div2, "id", "sidebar-wrapper");
    			attr_dev(div2, "rel", "../build/styles.css");
    			add_location(div2, file, 59, 12, 2781);
    			attr_dev(button0, "class", "btn btn-primary");
    			attr_dev(button0, "id", "sidebarToggle");
    			add_location(button0, file, 72, 24, 3628);
    			attr_dev(span, "class", "navbar-toggler-icon");
    			add_location(span, file, 73, 228, 3928);
    			attr_dev(button1, "class", "navbar-toggler");
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "data-bs-toggle", "collapse");
    			attr_dev(button1, "data-bs-target", "#navbarSupportedContent");
    			attr_dev(button1, "aria-controls", "navbarSupportedContent");
    			attr_dev(button1, "aria-expanded", "false");
    			attr_dev(button1, "aria-label", "Toggle navigation");
    			add_location(button1, file, 73, 24, 3724);
    			attr_dev(a0, "class", "nav-link");
    			attr_dev(a0, "href", "#!");
    			add_location(a0, file, 76, 91, 4255);
    			attr_dev(li0, "class", li0_class_value = "nav-item active " + /*is_darkmode_light*/ ctx[0] + /*font_mode*/ ctx[1]);
    			add_location(li0, file, 76, 32, 4196);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "href", "#!");
    			add_location(a1, file, 77, 53, 4352);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file, 77, 32, 4331);
    			attr_dev(a2, "class", "nav-link dropdown-toggle");
    			attr_dev(a2, "id", "navbarDropdown");
    			attr_dev(a2, "href", "#");
    			attr_dev(a2, "role", "button");
    			attr_dev(a2, "data-bs-toggle", "dropdown");
    			attr_dev(a2, "aria-haspopup", "true");
    			attr_dev(a2, "aria-expanded", "false");
    			add_location(a2, file, 79, 36, 4495);
    			attr_dev(div3, "class", "dropdown-divider");
    			add_location(div3, file, 84, 40, 5056);
    			attr_dev(a3, "class", a3_class_value = "dropdown-item" + /*font_mode*/ ctx[1]);
    			attr_dev(a3, "href", "#!");
    			add_location(a3, file, 85, 40, 5133);
    			attr_dev(div4, "class", div4_class_value = "dropdown-menu dropdown-menu-end " + /*is_darkmode_light*/ ctx[0]);
    			attr_dev(div4, "aria-labelledby", "navbarDropdown");
    			add_location(div4, file, 80, 36, 4692);
    			attr_dev(li2, "class", "nav-item dropdown");
    			add_location(li2, file, 78, 32, 4428);
    			attr_dev(ul, "class", "navbar-nav ms-auto mt-2 mt-lg-0");
    			add_location(ul, file, 75, 28, 4119);
    			attr_dev(div5, "class", div5_class_value = "collapse navbar-collapse " + /*is_darkmode_light*/ ctx[0]);
    			attr_dev(div5, "id", "navbarSupportedContent");
    			add_location(div5, file, 74, 24, 4003);
    			attr_dev(div6, "class", "container-fluid");
    			add_location(div6, file, 71, 20, 3574);
    			attr_dev(nav, "class", nav_class_value = "navbar navbar-expand-lg " + /*nav_bar*/ ctx[3] + " " + /*List_item_bgcolor*/ ctx[2] + " border-bottom");
    			add_location(nav, file, 70, 16, 3466);
    			add_location(div7, file, 92, 4, 5429);
    			attr_dev(div8, "id", "page-content-wrapper");
    			add_location(div8, file, 68, 12, 3379);
    			attr_dev(div9, "class", "d-flex");
    			attr_dev(div9, "id", "wrapper");
    			add_location(div9, file, 57, 8, 2707);
    			if (!src_url_equal(script.src, script_src_value = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file, 99, 8, 5592);
    			add_location(body, file, 56, 4, 2692);
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

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div1, null);
    			}

    			append_dev(div9, t10);
    			append_dev(div9, div8);
    			append_dev(div8, nav);
    			append_dev(nav, div6);
    			append_dev(div6, button0);
    			append_dev(div6, t12);
    			append_dev(div6, button1);
    			append_dev(button1, span);
    			append_dev(div6, t13);
    			append_dev(div6, div5);
    			append_dev(div5, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t15);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t17);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(li2, t19);
    			append_dev(li2, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			append_dev(div4, t20);
    			append_dev(div4, div3);
    			append_dev(div4, t21);
    			append_dev(div4, a3);
    			append_dev(a3, t22);
    			append_dev(div8, t23);
    			append_dev(div8, div7);
    			div7.innerHTML = /*context2*/ ctx[5];
    			append_dev(body, t24);
    			append_dev(body, script);

    			if (!mounted) {
    				dispose = listen_dev(a3, "click", /*funis_darkmode*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*is_darkmode_light, font_mode*/ 3 && div0_class_value !== (div0_class_value = "sidebar-heading border-bottom" + /*is_darkmode_light*/ ctx[0] + /*font_mode*/ ctx[1])) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*List_item_bgcolor, font_mode, menu_listsk1*/ 22) {
    				each_value_1 = /*menu_listsk1*/ ctx[4];
    				validate_each_argument(each_value_1);
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_1, each0_lookup, div1, destroy_block, create_each_block_1, null, get_each_context_1);
    			}

    			if (dirty & /*is_darkmode_light*/ 1 && div2_class_value !== (div2_class_value = "border-end " + /*is_darkmode_light*/ ctx[0])) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (dirty & /*is_darkmode_light, font_mode*/ 3 && li0_class_value !== (li0_class_value = "nav-item active " + /*is_darkmode_light*/ ctx[0] + /*font_mode*/ ctx[1])) {
    				attr_dev(li0, "class", li0_class_value);
    			}

    			if (dirty & /*font_mode, dropdown*/ 66) {
    				each_value = /*dropdown*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div4, t20);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*font_mode*/ 2 && a3_class_value !== (a3_class_value = "dropdown-item" + /*font_mode*/ ctx[1])) {
    				attr_dev(a3, "class", a3_class_value);
    			}

    			if (dirty & /*is_darkmode_light*/ 1 && div4_class_value !== (div4_class_value = "dropdown-menu dropdown-menu-end " + /*is_darkmode_light*/ ctx[0])) {
    				attr_dev(div4, "class", div4_class_value);
    			}

    			if (dirty & /*is_darkmode_light*/ 1 && div5_class_value !== (div5_class_value = "collapse navbar-collapse " + /*is_darkmode_light*/ ctx[0])) {
    				attr_dev(div5, "class", div5_class_value);
    			}

    			if (dirty & /*nav_bar, List_item_bgcolor*/ 12 && nav_class_value !== (nav_class_value = "navbar navbar-expand-lg " + /*nav_bar*/ ctx[3] + " " + /*List_item_bgcolor*/ ctx[2] + " border-bottom")) {
    				attr_dev(nav, "class", nav_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(head);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(body);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
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
    		{ id: 1, label: "Home", href: "#" },
    		{ id: 2, label: "Blog", href: "#" },
    		{ id: 3, label: "Posts", href: "#" },
    		{ id: 4, label: "Contact", href: "#" },
    		{ id: 5, label: "profile", href: "#" },
    		{ id: 6, label: "Other Site", href: "#" }
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
    			$$invalidate(1, font_mode = " text-white");
    			is_darkmode = "bg-black";
    			$$invalidate(0, is_darkmode_light = "bg-dark");
    			$$invalidate(2, List_item_bgcolor = "list-group-item-dark");
    			$$invalidate(3, nav_bar = "navbar-dark");
    			console.log("be black");
    		} else {
    			$$invalidate(2, List_item_bgcolor = "list-group-item-light");
    			is_darkmode = "bg-white";
    			$$invalidate(0, is_darkmode_light = "bg-light");
    			$$invalidate(1, font_mode = "");
    			$$invalidate(2, List_item_bgcolor = "list-group-item-light");
    			$$invalidate(3, nav_bar = "navbar-light");
    			console.log("be white");
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

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
    		funis_darkmode
    	});

    	$$self.$inject_state = $$props => {
    		if ('menu_listsk1' in $$props) $$invalidate(4, menu_listsk1 = $$props.menu_listsk1);
    		if ('context2' in $$props) $$invalidate(5, context2 = $$props.context2);
    		if ('link' in $$props) link = $$props.link;
    		if ('dropdown' in $$props) $$invalidate(6, dropdown = $$props.dropdown);
    		if ('navbar' in $$props) navbar = $$props.navbar;
    		if ('is_darkmode' in $$props) is_darkmode = $$props.is_darkmode;
    		if ('is_darkmode_light' in $$props) $$invalidate(0, is_darkmode_light = $$props.is_darkmode_light);
    		if ('font_mode' in $$props) $$invalidate(1, font_mode = $$props.font_mode);
    		if ('List_item_bgcolor' in $$props) $$invalidate(2, List_item_bgcolor = $$props.List_item_bgcolor);
    		if ('nav_bar' in $$props) $$invalidate(3, nav_bar = $$props.nav_bar);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		is_darkmode_light,
    		font_mode,
    		List_item_bgcolor,
    		nav_bar,
    		menu_listsk1,
    		context2,
    		dropdown,
    		funis_darkmode
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

    return app;

})();
//# sourceMappingURL=bundle.js.map
