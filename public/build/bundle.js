
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
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
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

    /* src\main.svelte generated by Svelte v3.47.0 */

    const file$4 = "src\\main.svelte";

    function create_fragment$4(ctx) {
    	let header;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let span;
    	let t3;
    	let div11;
    	let div10;
    	let div9;
    	let div4;
    	let a0;
    	let h20;
    	let t5;
    	let h30;
    	let t7;
    	let p0;
    	let t8;
    	let a1;
    	let t10;
    	let t11;
    	let hr0;
    	let t12;
    	let div5;
    	let a2;
    	let h21;
    	let t14;
    	let p1;
    	let t15;
    	let a3;
    	let t17;
    	let t18;
    	let hr1;
    	let t19;
    	let div6;
    	let a4;
    	let h22;
    	let t21;
    	let h31;
    	let t23;
    	let p2;
    	let t24;
    	let a5;
    	let t26;
    	let t27;
    	let hr2;
    	let t28;
    	let div7;
    	let a6;
    	let h23;
    	let t30;
    	let h32;
    	let t32;
    	let p3;
    	let t33;
    	let a7;
    	let t35;
    	let t36;
    	let hr3;
    	let t37;
    	let div8;
    	let a8;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Clean Blog";
    			t1 = space();
    			span = element("span");
    			span.textContent = "A Blog Theme by Start Bootstrap";
    			t3 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			div4 = element("div");
    			a0 = element("a");
    			h20 = element("h2");
    			h20.textContent = "Man must explore, and this is exploration at its greatest";
    			t5 = space();
    			h30 = element("h3");
    			h30.textContent = "Problems look mighty small from 150 miles up";
    			t7 = space();
    			p0 = element("p");
    			t8 = text("Posted by\r\n                    ");
    			a1 = element("a");
    			a1.textContent = "Start Bootstrap";
    			t10 = text("\r\n                    on September 24, 2022");
    			t11 = space();
    			hr0 = element("hr");
    			t12 = space();
    			div5 = element("div");
    			a2 = element("a");
    			h21 = element("h2");
    			h21.textContent = "I believe every human has a finite number of heartbeats. I don't intend to waste any of mine.";
    			t14 = space();
    			p1 = element("p");
    			t15 = text("Posted by\r\n                    ");
    			a3 = element("a");
    			a3.textContent = "Start Bootstrap";
    			t17 = text("\r\n                    on September 18, 2022");
    			t18 = space();
    			hr1 = element("hr");
    			t19 = space();
    			div6 = element("div");
    			a4 = element("a");
    			h22 = element("h2");
    			h22.textContent = "Science has not yet mastered prophecy";
    			t21 = space();
    			h31 = element("h3");
    			h31.textContent = "We predict too much for the next year and yet far too little for the next ten.";
    			t23 = space();
    			p2 = element("p");
    			t24 = text("Posted by\r\n                    ");
    			a5 = element("a");
    			a5.textContent = "Start Bootstrap";
    			t26 = text("\r\n                    on August 24, 2022");
    			t27 = space();
    			hr2 = element("hr");
    			t28 = space();
    			div7 = element("div");
    			a6 = element("a");
    			h23 = element("h2");
    			h23.textContent = "Failure is not an option";
    			t30 = space();
    			h32 = element("h3");
    			h32.textContent = "Many say exploration is part of our destiny, but it’s actually our duty to future generations.";
    			t32 = space();
    			p3 = element("p");
    			t33 = text("Posted by\r\n                    ");
    			a7 = element("a");
    			a7.textContent = "Start Bootstrap";
    			t35 = text("\r\n                    on July 8, 2022");
    			t36 = space();
    			hr3 = element("hr");
    			t37 = space();
    			div8 = element("div");
    			a8 = element("a");
    			a8.textContent = "Older Posts →";
    			add_location(h1, file$4, 6, 28, 404);
    			attr_dev(span, "class", "subheading");
    			add_location(span, file$4, 7, 28, 453);
    			attr_dev(div0, "class", "site-heading");
    			add_location(div0, file$4, 5, 24, 348);
    			attr_dev(div1, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div1, file$4, 4, 20, 281);
    			attr_dev(div2, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div2, file$4, 3, 16, 206);
    			attr_dev(div3, "class", "container position-relative px-4 px-lg-5");
    			add_location(div3, file$4, 2, 12, 134);
    			attr_dev(header, "class", "masthead");
    			set_style(header, "background-image", "url('assets/img/home-bg.jpg')");
    			add_location(header, file$4, 1, 9, 39);
    			attr_dev(h20, "class", "post-title");
    			add_location(h20, file$4, 20, 20, 945);
    			attr_dev(h30, "class", "post-subtitle");
    			add_location(h30, file$4, 21, 20, 1052);
    			attr_dev(a0, "href", "post.html");
    			add_location(a0, file$4, 19, 16, 903);
    			attr_dev(a1, "href", "#!");
    			add_location(a1, file$4, 25, 20, 1241);
    			attr_dev(p0, "class", "post-meta");
    			add_location(p0, file$4, 23, 16, 1167);
    			attr_dev(div4, "class", "post-preview");
    			add_location(div4, file$4, 18, 12, 859);
    			attr_dev(hr0, "class", "my-4");
    			add_location(hr0, file$4, 30, 12, 1401);
    			attr_dev(h21, "class", "post-title");
    			add_location(h21, file$4, 33, 36, 1532);
    			attr_dev(a2, "href", "post.html");
    			add_location(a2, file$4, 33, 16, 1512);
    			attr_dev(a3, "href", "#!");
    			add_location(a3, file$4, 36, 20, 1749);
    			attr_dev(p1, "class", "post-meta");
    			add_location(p1, file$4, 34, 16, 1675);
    			attr_dev(div5, "class", "post-preview");
    			add_location(div5, file$4, 32, 12, 1468);
    			attr_dev(hr1, "class", "my-4");
    			add_location(hr1, file$4, 41, 12, 1909);
    			attr_dev(h22, "class", "post-title");
    			add_location(h22, file$4, 45, 20, 2062);
    			attr_dev(h31, "class", "post-subtitle");
    			add_location(h31, file$4, 46, 20, 2149);
    			attr_dev(a4, "href", "post.html");
    			add_location(a4, file$4, 44, 16, 2020);
    			attr_dev(a5, "href", "#!");
    			add_location(a5, file$4, 50, 20, 2372);
    			attr_dev(p2, "class", "post-meta");
    			add_location(p2, file$4, 48, 16, 2298);
    			attr_dev(div6, "class", "post-preview");
    			add_location(div6, file$4, 43, 12, 1976);
    			attr_dev(hr2, "class", "my-4");
    			add_location(hr2, file$4, 55, 12, 2529);
    			attr_dev(h23, "class", "post-title");
    			add_location(h23, file$4, 59, 20, 2682);
    			attr_dev(h32, "class", "post-subtitle");
    			add_location(h32, file$4, 60, 20, 2756);
    			attr_dev(a6, "href", "post.html");
    			add_location(a6, file$4, 58, 16, 2640);
    			attr_dev(a7, "href", "#!");
    			add_location(a7, file$4, 64, 20, 2995);
    			attr_dev(p3, "class", "post-meta");
    			add_location(p3, file$4, 62, 16, 2921);
    			attr_dev(div7, "class", "post-preview");
    			add_location(div7, file$4, 57, 12, 2596);
    			attr_dev(hr3, "class", "my-4");
    			add_location(hr3, file$4, 69, 12, 3149);
    			attr_dev(a8, "class", "btn btn-primary text-uppercase");
    			attr_dev(a8, "href", "#!");
    			add_location(a8, file$4, 71, 57, 3254);
    			attr_dev(div8, "class", "d-flex justify-content-end mb-4");
    			add_location(div8, file$4, 71, 12, 3209);
    			attr_dev(div9, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div9, file$4, 16, 8, 770);
    			attr_dev(div10, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div10, file$4, 15, 4, 707);
    			attr_dev(div11, "class", "container px-4 px-lg-5");
    			add_location(div11, file$4, 14, 1, 665);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, span);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div4);
    			append_dev(div4, a0);
    			append_dev(a0, h20);
    			append_dev(a0, t5);
    			append_dev(a0, h30);
    			append_dev(div4, t7);
    			append_dev(div4, p0);
    			append_dev(p0, t8);
    			append_dev(p0, a1);
    			append_dev(p0, t10);
    			append_dev(div9, t11);
    			append_dev(div9, hr0);
    			append_dev(div9, t12);
    			append_dev(div9, div5);
    			append_dev(div5, a2);
    			append_dev(a2, h21);
    			append_dev(div5, t14);
    			append_dev(div5, p1);
    			append_dev(p1, t15);
    			append_dev(p1, a3);
    			append_dev(p1, t17);
    			append_dev(div9, t18);
    			append_dev(div9, hr1);
    			append_dev(div9, t19);
    			append_dev(div9, div6);
    			append_dev(div6, a4);
    			append_dev(a4, h22);
    			append_dev(a4, t21);
    			append_dev(a4, h31);
    			append_dev(div6, t23);
    			append_dev(div6, p2);
    			append_dev(p2, t24);
    			append_dev(p2, a5);
    			append_dev(p2, t26);
    			append_dev(div9, t27);
    			append_dev(div9, hr2);
    			append_dev(div9, t28);
    			append_dev(div9, div7);
    			append_dev(div7, a6);
    			append_dev(a6, h23);
    			append_dev(a6, t30);
    			append_dev(a6, h32);
    			append_dev(div7, t32);
    			append_dev(div7, p3);
    			append_dev(p3, t33);
    			append_dev(p3, a7);
    			append_dev(p3, t35);
    			append_dev(div9, t36);
    			append_dev(div9, hr3);
    			append_dev(div9, t37);
    			append_dev(div9, div8);
    			append_dev(div8, a8);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div11);
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

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\about.svelte generated by Svelte v3.47.0 */

    const file$3 = "src\\about.svelte";

    function create_fragment$3(ctx) {
    	let header;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let span;
    	let t3;
    	let main;
    	let div6;
    	let div5;
    	let div4;
    	let p0;
    	let t5;
    	let p1;
    	let t7;
    	let p2;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "About Me";
    			t1 = space();
    			span = element("span");
    			span.textContent = "This is what I do.";
    			t3 = space();
    			main = element("main");
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			p0 = element("p");
    			p0.textContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe nostrum ullam eveniet pariatur voluptates odit, fuga atque ea nobis sit soluta odio, adipisci quas excepturi maxime quae totam ducimus consectetur?";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius praesentium recusandae illo eaque architecto error, repellendus iusto reprehenderit, doloribus, minus sunt. Numquam at quae voluptatum in officia voluptas voluptatibus, minus!";
    			t7 = space();
    			p2 = element("p");
    			p2.textContent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut consequuntur magnam, excepturi aliquid ex itaque esse est vero natus quae optio aperiam soluta voluptatibus corporis atque iste neque sit tempora!";
    			add_location(h1, file$3, 5, 20, 326);
    			attr_dev(span, "class", "subheading");
    			add_location(span, file$3, 6, 20, 365);
    			attr_dev(div0, "class", "page-heading");
    			add_location(div0, file$3, 4, 16, 278);
    			attr_dev(div1, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div1, file$3, 3, 12, 219);
    			attr_dev(div2, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div2, file$3, 2, 8, 152);
    			attr_dev(div3, "class", "container position-relative px-4 px-lg-5");
    			add_location(div3, file$3, 1, 4, 88);
    			attr_dev(header, "class", "masthead");
    			set_style(header, "background-image", "url('assets/img/about-bg.jpg')");
    			add_location(header, file$3, 0, 0, 0);
    			add_location(p0, file$3, 17, 16, 719);
    			add_location(p1, file$3, 18, 16, 955);
    			add_location(p2, file$3, 19, 16, 1218);
    			attr_dev(div4, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div4, file$3, 16, 12, 660);
    			attr_dev(div5, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div5, file$3, 15, 8, 593);
    			attr_dev(div6, "class", "container px-4 px-lg-5");
    			add_location(div6, file$3, 14, 4, 547);
    			attr_dev(main, "class", "mb-4");
    			add_location(main, file$3, 13, 0, 522);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, span);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, p0);
    			append_dev(div4, t5);
    			append_dev(div4, p1);
    			append_dev(div4, t7);
    			append_dev(div4, p2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(main);
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

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\contact.svelte generated by Svelte v3.47.0 */

    const file$2 = "src\\contact.svelte";

    function create_fragment$2(ctx) {
    	let header;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let span;
    	let t3;
    	let main;
    	let div21;
    	let div20;
    	let div19;
    	let p;
    	let t5;
    	let div18;
    	let form;
    	let div5;
    	let input0;
    	let t6;
    	let label0;
    	let t8;
    	let div4;
    	let t10;
    	let div8;
    	let input1;
    	let t11;
    	let label1;
    	let t13;
    	let div6;
    	let t15;
    	let div7;
    	let t17;
    	let div10;
    	let input2;
    	let t18;
    	let label2;
    	let t20;
    	let div9;
    	let t22;
    	let div12;
    	let textarea;
    	let t23;
    	let label3;
    	let t25;
    	let div11;
    	let t27;
    	let br0;
    	let t28;
    	let div15;
    	let div14;
    	let div13;
    	let t30;
    	let br1;
    	let t31;
    	let a;
    	let t33;
    	let div17;
    	let div16;
    	let t35;
    	let button;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Contact Me";
    			t1 = space();
    			span = element("span");
    			span.textContent = "Have questions? I have answers.";
    			t3 = space();
    			main = element("main");
    			div21 = element("div");
    			div20 = element("div");
    			div19 = element("div");
    			p = element("p");
    			p.textContent = "Want to get in touch? Fill out the form below to send me a message and I will get back to you as soon as possible!";
    			t5 = space();
    			div18 = element("div");
    			form = element("form");
    			div5 = element("div");
    			input0 = element("input");
    			t6 = space();
    			label0 = element("label");
    			label0.textContent = "Name";
    			t8 = space();
    			div4 = element("div");
    			div4.textContent = "A name is required.";
    			t10 = space();
    			div8 = element("div");
    			input1 = element("input");
    			t11 = space();
    			label1 = element("label");
    			label1.textContent = "Email address";
    			t13 = space();
    			div6 = element("div");
    			div6.textContent = "An email is required.";
    			t15 = space();
    			div7 = element("div");
    			div7.textContent = "Email is not valid.";
    			t17 = space();
    			div10 = element("div");
    			input2 = element("input");
    			t18 = space();
    			label2 = element("label");
    			label2.textContent = "Phone Number";
    			t20 = space();
    			div9 = element("div");
    			div9.textContent = "A phone number is required.";
    			t22 = space();
    			div12 = element("div");
    			textarea = element("textarea");
    			t23 = space();
    			label3 = element("label");
    			label3.textContent = "Message";
    			t25 = space();
    			div11 = element("div");
    			div11.textContent = "A message is required.";
    			t27 = space();
    			br0 = element("br");
    			t28 = space();
    			div15 = element("div");
    			div14 = element("div");
    			div13 = element("div");
    			div13.textContent = "Form submission successful!";
    			t30 = text("\r\n                                To activate this form, sign up at\r\n                                ");
    			br1 = element("br");
    			t31 = space();
    			a = element("a");
    			a.textContent = "https://startbootstrap.com/solution/contact-forms";
    			t33 = space();
    			div17 = element("div");
    			div16 = element("div");
    			div16.textContent = "Error sending message!";
    			t35 = space();
    			button = element("button");
    			button.textContent = "Send";
    			add_location(h1, file$2, 5, 20, 328);
    			attr_dev(span, "class", "subheading");
    			add_location(span, file$2, 6, 20, 369);
    			attr_dev(div0, "class", "page-heading");
    			add_location(div0, file$2, 4, 16, 280);
    			attr_dev(div1, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div1, file$2, 3, 12, 221);
    			attr_dev(div2, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div2, file$2, 2, 8, 154);
    			attr_dev(div3, "class", "container position-relative px-4 px-lg-5");
    			add_location(div3, file$2, 1, 4, 90);
    			attr_dev(header, "class", "masthead");
    			set_style(header, "background-image", "url('assets/img/contact-bg.jpg')");
    			add_location(header, file$2, 0, 0, 0);
    			add_location(p, file$2, 17, 16, 736);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Enter your name...");
    			attr_dev(input0, "data-sb-validations", "required");
    			add_location(input0, file$2, 28, 28, 1504);
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$2, 29, 28, 1650);
    			attr_dev(div4, "class", "invalid-feedback");
    			attr_dev(div4, "data-sb-feedback", "name:required");
    			add_location(div4, file$2, 30, 28, 1710);
    			attr_dev(div5, "class", "form-floating");
    			add_location(div5, file$2, 27, 24, 1447);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "email");
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "placeholder", "Enter your email...");
    			attr_dev(input1, "data-sb-validations", "required,email");
    			add_location(input1, file$2, 33, 28, 1913);
    			attr_dev(label1, "for", "email");
    			add_location(label1, file$2, 34, 28, 2068);
    			attr_dev(div6, "class", "invalid-feedback");
    			attr_dev(div6, "data-sb-feedback", "email:required");
    			add_location(div6, file$2, 35, 28, 2138);
    			attr_dev(div7, "class", "invalid-feedback");
    			attr_dev(div7, "data-sb-feedback", "email:email");
    			add_location(div7, file$2, 36, 28, 2259);
    			attr_dev(div8, "class", "form-floating");
    			add_location(div8, file$2, 32, 24, 1856);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "phone");
    			attr_dev(input2, "type", "tel");
    			attr_dev(input2, "placeholder", "Enter your phone number...");
    			attr_dev(input2, "data-sb-validations", "required");
    			add_location(input2, file$2, 39, 28, 2460);
    			attr_dev(label2, "for", "phone");
    			add_location(label2, file$2, 40, 28, 2614);
    			attr_dev(div9, "class", "invalid-feedback");
    			attr_dev(div9, "data-sb-feedback", "phone:required");
    			add_location(div9, file$2, 41, 28, 2683);
    			attr_dev(div10, "class", "form-floating");
    			add_location(div10, file$2, 38, 24, 2403);
    			attr_dev(textarea, "class", "form-control");
    			attr_dev(textarea, "id", "message");
    			attr_dev(textarea, "placeholder", "Enter your message here...");
    			set_style(textarea, "height", "12rem");
    			attr_dev(textarea, "data-sb-validations", "required");
    			add_location(textarea, file$2, 44, 28, 2895);
    			attr_dev(label3, "for", "message");
    			add_location(label3, file$2, 45, 28, 3074);
    			attr_dev(div11, "class", "invalid-feedback");
    			attr_dev(div11, "data-sb-feedback", "message:required");
    			add_location(div11, file$2, 46, 28, 3140);
    			attr_dev(div12, "class", "form-floating");
    			add_location(div12, file$2, 43, 24, 2838);
    			add_location(br0, file$2, 48, 24, 3292);
    			attr_dev(div13, "class", "fw-bolder");
    			add_location(div13, file$2, 55, 32, 3693);
    			add_location(br1, file$2, 57, 32, 3850);
    			attr_dev(a, "href", "https://startbootstrap.com/solution/contact-forms");
    			add_location(a, file$2, 58, 32, 3890);
    			attr_dev(div14, "class", "text-center mb-3");
    			add_location(div14, file$2, 54, 28, 3629);
    			attr_dev(div15, "class", "d-none");
    			attr_dev(div15, "id", "submitSuccessMessage");
    			add_location(div15, file$2, 53, 24, 3553);
    			attr_dev(div16, "class", "text-center text-danger mb-3");
    			add_location(div16, file$2, 65, 68, 4370);
    			attr_dev(div17, "class", "d-none");
    			attr_dev(div17, "id", "submitErrorMessage");
    			add_location(div17, file$2, 65, 24, 4326);
    			attr_dev(button, "class", "btn btn-primary text-uppercase disabled");
    			attr_dev(button, "id", "submitButton");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$2, 67, 24, 4519);
    			attr_dev(form, "id", "contactForm");
    			attr_dev(form, "data-sb-form-api-token", "API_TOKEN");
    			add_location(form, file$2, 26, 20, 1363);
    			attr_dev(div18, "class", "my-5");
    			add_location(div18, file$2, 18, 16, 875);
    			attr_dev(div19, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div19, file$2, 16, 12, 677);
    			attr_dev(div20, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div20, file$2, 15, 8, 610);
    			attr_dev(div21, "class", "container px-4 px-lg-5");
    			add_location(div21, file$2, 14, 4, 564);
    			attr_dev(main, "class", "mb-4");
    			add_location(main, file$2, 13, 0, 539);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, span);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div21);
    			append_dev(div21, div20);
    			append_dev(div20, div19);
    			append_dev(div19, p);
    			append_dev(div19, t5);
    			append_dev(div19, div18);
    			append_dev(div18, form);
    			append_dev(form, div5);
    			append_dev(div5, input0);
    			append_dev(div5, t6);
    			append_dev(div5, label0);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(form, t10);
    			append_dev(form, div8);
    			append_dev(div8, input1);
    			append_dev(div8, t11);
    			append_dev(div8, label1);
    			append_dev(div8, t13);
    			append_dev(div8, div6);
    			append_dev(div8, t15);
    			append_dev(div8, div7);
    			append_dev(form, t17);
    			append_dev(form, div10);
    			append_dev(div10, input2);
    			append_dev(div10, t18);
    			append_dev(div10, label2);
    			append_dev(div10, t20);
    			append_dev(div10, div9);
    			append_dev(form, t22);
    			append_dev(form, div12);
    			append_dev(div12, textarea);
    			append_dev(div12, t23);
    			append_dev(div12, label3);
    			append_dev(div12, t25);
    			append_dev(div12, div11);
    			append_dev(form, t27);
    			append_dev(form, br0);
    			append_dev(form, t28);
    			append_dev(form, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div14, t30);
    			append_dev(div14, br1);
    			append_dev(div14, t31);
    			append_dev(div14, a);
    			append_dev(form, t33);
    			append_dev(form, div17);
    			append_dev(div17, div16);
    			append_dev(form, t35);
    			append_dev(form, button);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(main);
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

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\post.svelte generated by Svelte v3.47.0 */

    const file$1 = "src\\post.svelte";

    function create_fragment$1(ctx) {
    	let header;
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let h20;
    	let t3;
    	let span0;
    	let t4;
    	let a0;
    	let t6;
    	let t7;
    	let article;
    	let div6;
    	let div5;
    	let div4;
    	let p0;
    	let t9;
    	let p1;
    	let t11;
    	let p2;
    	let t13;
    	let p3;
    	let t15;
    	let p4;
    	let t17;
    	let h21;
    	let t19;
    	let p5;
    	let t21;
    	let p6;
    	let t23;
    	let blockquote;
    	let t25;
    	let p7;
    	let t27;
    	let h22;
    	let t29;
    	let p8;
    	let t31;
    	let a1;
    	let img;
    	let img_src_value;
    	let t32;
    	let span1;
    	let t34;
    	let p9;
    	let t36;
    	let p10;
    	let t38;
    	let p11;
    	let t39;
    	let a2;
    	let t41;
    	let a3;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Man must explore, and this is exploration at its greatest";
    			t1 = space();
    			h20 = element("h2");
    			h20.textContent = "Problems look mighty small from 150 miles up";
    			t3 = space();
    			span0 = element("span");
    			t4 = text("Posted by\r\n                        ");
    			a0 = element("a");
    			a0.textContent = "Start Bootstrap";
    			t6 = text("\r\n                        on August 24, 2022");
    			t7 = space();
    			article = element("article");
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			p0 = element("p");
    			p0.textContent = "Never in all their history have men been able truly to conceive of the world as one: a single sphere, a globe, having the qualities of a globe, a round earth in which all the directions eventually meet, in which there is no center because every point, or none, is center — an equal earth which all men occupy as equals. The airman's earth, if free men make it, will be truly round: a globe in practice, not in theory.";
    			t9 = space();
    			p1 = element("p");
    			p1.textContent = "Science cuts two ways, of course; its products can be used for both good and evil. But there's no turning back from science. The early warnings about technological dangers also come from science.";
    			t11 = space();
    			p2 = element("p");
    			p2.textContent = "What was most significant about the lunar voyage was not that man set foot on the Moon but that they set eye on the earth.";
    			t13 = space();
    			p3 = element("p");
    			p3.textContent = "A Chinese tale tells of some men sent to harm a young girl who, upon seeing her beauty, become her protectors rather than her violators. That's how I felt seeing the Earth for the first time. I could not help but love and cherish her.";
    			t15 = space();
    			p4 = element("p");
    			p4.textContent = "For those who have seen the Earth from space, and for the hundreds and perhaps thousands more who will, the experience most certainly changes your perspective. The things that we share in our world are far more valuable than those which divide us.";
    			t17 = space();
    			h21 = element("h2");
    			h21.textContent = "The Final Frontier";
    			t19 = space();
    			p5 = element("p");
    			p5.textContent = "There can be no thought of finishing for ‘aiming for the stars.’ Both figuratively and literally, it is a task to occupy the generations. And no matter how much progress one makes, there is always the thrill of just beginning.";
    			t21 = space();
    			p6 = element("p");
    			p6.textContent = "There can be no thought of finishing for ‘aiming for the stars.’ Both figuratively and literally, it is a task to occupy the generations. And no matter how much progress one makes, there is always the thrill of just beginning.";
    			t23 = space();
    			blockquote = element("blockquote");
    			blockquote.textContent = "The dreams of yesterday are the hopes of today and the reality of tomorrow. Science has not yet mastered prophecy. We predict too much for the next year and yet far too little for the next ten.";
    			t25 = space();
    			p7 = element("p");
    			p7.textContent = "Spaceflights cannot be stopped. This is not the work of any one man or even a group of men. It is a historical process which mankind is carrying out in accordance with the natural laws of human development.";
    			t27 = space();
    			h22 = element("h2");
    			h22.textContent = "Reaching for the Stars";
    			t29 = space();
    			p8 = element("p");
    			p8.textContent = "As we got further and further away, it [the Earth] diminished in size. Finally it shrank to the size of a marble, the most beautiful you can imagine. That beautiful, warm, living object looked so fragile, so delicate, that if you touched it with a finger it would crumble and fall apart. Seeing this has to change a man.";
    			t31 = space();
    			a1 = element("a");
    			img = element("img");
    			t32 = space();
    			span1 = element("span");
    			span1.textContent = "To go places and do things that have never been done before – that’s what living is all about.";
    			t34 = space();
    			p9 = element("p");
    			p9.textContent = "Space, the final frontier. These are the voyages of the Starship Enterprise. Its five-year mission: to explore strange new worlds, to seek out new life and new civilizations, to boldly go where no man has gone before.";
    			t36 = space();
    			p10 = element("p");
    			p10.textContent = "As I stand out here in the wonders of the unknown at Hadley, I sort of realize there’s a fundamental truth to our nature, Man must explore, and this is exploration at its greatest.";
    			t38 = space();
    			p11 = element("p");
    			t39 = text("Placeholder text by\r\n                    ");
    			a2 = element("a");
    			a2.textContent = "Space Ipsum";
    			t41 = text("\r\n                    · Images by\r\n                    ");
    			a3 = element("a");
    			a3.textContent = "NASA on The Commons";
    			add_location(h1, file$1, 9, 20, 371);
    			attr_dev(h20, "class", "subheading");
    			add_location(h20, file$1, 10, 20, 459);
    			attr_dev(a0, "href", "#!");
    			add_location(a0, file$1, 13, 24, 633);
    			attr_dev(span0, "class", "meta");
    			add_location(span0, file$1, 11, 20, 553);
    			attr_dev(div0, "class", "post-heading");
    			add_location(div0, file$1, 8, 16, 323);
    			attr_dev(div1, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div1, file$1, 7, 12, 264);
    			attr_dev(div2, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div2, file$1, 6, 8, 197);
    			attr_dev(div3, "class", "container position-relative px-4 px-lg-5");
    			add_location(div3, file$1, 5, 4, 133);
    			attr_dev(header, "class", "masthead");
    			set_style(header, "background-image", "url('assets/img/post-bg.jpg')");
    			add_location(header, file$1, 4, 0, 46);
    			add_location(p0, file$1, 26, 16, 1045);
    			add_location(p1, file$1, 27, 16, 1487);
    			add_location(p2, file$1, 28, 16, 1707);
    			add_location(p3, file$1, 29, 16, 1854);
    			add_location(p4, file$1, 30, 16, 2113);
    			attr_dev(h21, "class", "section-heading");
    			add_location(h21, file$1, 31, 16, 2385);
    			add_location(p5, file$1, 32, 16, 2454);
    			add_location(p6, file$1, 33, 16, 2705);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$1, 34, 16, 2956);
    			add_location(p7, file$1, 35, 16, 3211);
    			attr_dev(h22, "class", "section-heading");
    			add_location(h22, file$1, 36, 16, 3442);
    			add_location(p8, file$1, 37, 16, 3515);
    			attr_dev(img, "class", "img-fluid");
    			if (!src_url_equal(img.src, img_src_value = "assets/img/post-sample-image.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "...");
    			add_location(img, file$1, 38, 29, 3873);
    			attr_dev(a1, "href", "#!");
    			add_location(a1, file$1, 38, 16, 3860);
    			attr_dev(span1, "class", "caption text-muted");
    			add_location(span1, file$1, 39, 16, 3969);
    			add_location(p9, file$1, 40, 16, 4121);
    			add_location(p10, file$1, 41, 16, 4363);
    			attr_dev(a2, "href", "http://spaceipsum.com/");
    			add_location(a2, file$1, 44, 20, 4634);
    			attr_dev(a3, "href", "https://www.flickr.com/photos/nasacommons/");
    			add_location(a3, file$1, 46, 20, 4744);
    			add_location(p11, file$1, 42, 16, 4568);
    			attr_dev(div4, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div4, file$1, 25, 12, 986);
    			attr_dev(div5, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div5, file$1, 24, 8, 919);
    			attr_dev(div6, "class", "container px-4 px-lg-5");
    			add_location(div6, file$1, 23, 4, 873);
    			attr_dev(article, "class", "mb-4");
    			add_location(article, file$1, 22, 0, 845);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, h20);
    			append_dev(div0, t3);
    			append_dev(div0, span0);
    			append_dev(span0, t4);
    			append_dev(span0, a0);
    			append_dev(span0, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, article, anchor);
    			append_dev(article, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, p0);
    			append_dev(div4, t9);
    			append_dev(div4, p1);
    			append_dev(div4, t11);
    			append_dev(div4, p2);
    			append_dev(div4, t13);
    			append_dev(div4, p3);
    			append_dev(div4, t15);
    			append_dev(div4, p4);
    			append_dev(div4, t17);
    			append_dev(div4, h21);
    			append_dev(div4, t19);
    			append_dev(div4, p5);
    			append_dev(div4, t21);
    			append_dev(div4, p6);
    			append_dev(div4, t23);
    			append_dev(div4, blockquote);
    			append_dev(div4, t25);
    			append_dev(div4, p7);
    			append_dev(div4, t27);
    			append_dev(div4, h22);
    			append_dev(div4, t29);
    			append_dev(div4, p8);
    			append_dev(div4, t31);
    			append_dev(div4, a1);
    			append_dev(a1, img);
    			append_dev(div4, t32);
    			append_dev(div4, span1);
    			append_dev(div4, t34);
    			append_dev(div4, p9);
    			append_dev(div4, t36);
    			append_dev(div4, p10);
    			append_dev(div4, t38);
    			append_dev(div4, p11);
    			append_dev(p11, t39);
    			append_dev(p11, a2);
    			append_dev(p11, t41);
    			append_dev(p11, a3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(article);
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
    	validate_slots('Post', slots, []);
    	let { Link } = $$props;
    	const writable_props = ['Link'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Post> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('Link' in $$props) $$invalidate(0, Link = $$props.Link);
    	};

    	$$self.$capture_state = () => ({ Link });

    	$$self.$inject_state = $$props => {
    		if ('Link' in $$props) $$invalidate(0, Link = $$props.Link);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [Link];
    }

    class Post extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { Link: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Post",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*Link*/ ctx[0] === undefined && !('Link' in props)) {
    			console.warn("<Post> was created without expected prop 'Link'");
    		}
    	}

    	get Link() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Link(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.47.0 */
    const file = "src\\App.svelte";

    // (49:31) 
    function create_if_block_3(ctx) {
    	let post;
    	let current;
    	post = new Post({ props: { Link: "0" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(post.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(post, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(post.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(post.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(post, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(49:31) ",
    		ctx
    	});

    	return block;
    }

    // (47:34) 
    function create_if_block_2(ctx) {
    	let contact;
    	let current;
    	contact = new Contact({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(contact.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contact, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contact, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(47:34) ",
    		ctx
    	});

    	return block;
    }

    // (45:34) 
    function create_if_block_1(ctx) {
    	let about;
    	let current;
    	about = new About({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(about.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(about, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(about.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(about.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(about, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(45:34) ",
    		ctx
    	});

    	return block;
    }

    // (43:2) {#if (viewmode == 'Home') }
    function create_if_block(ctx) {
    	let mainview;
    	let current;
    	mainview = new Main({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(mainview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mainview, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mainview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(43:2) {#if (viewmode == 'Home') }",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let html;
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
    	let script0;
    	let script0_src_value;
    	let t7;
    	let link1;
    	let t8;
    	let link2;
    	let t9;
    	let link3;
    	let t10;
    	let body;
    	let nav;
    	let div1;
    	let a0;
    	let t12;
    	let button;
    	let t13;
    	let i0;
    	let t14;
    	let div0;
    	let ul0;
    	let li0;
    	let a1;
    	let t16;
    	let li1;
    	let a2;
    	let t18;
    	let li2;
    	let a3;
    	let t20;
    	let li3;
    	let a4;
    	let t22;
    	let current_block_type_index;
    	let if_block;
    	let t23;
    	let footer;
    	let div5;
    	let div4;
    	let div3;
    	let ul1;
    	let li4;
    	let a5;
    	let span0;
    	let i1;
    	let t24;
    	let i2;
    	let t25;
    	let li5;
    	let a6;
    	let span1;
    	let i3;
    	let t26;
    	let i4;
    	let t27;
    	let li6;
    	let a7;
    	let span2;
    	let i5;
    	let t28;
    	let i6;
    	let t29;
    	let div2;
    	let t31;
    	let script1;
    	let script1_src_value;
    	let t32;
    	let script2;
    	let script2_src_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*viewmode*/ ctx[0] == 'Home') return 0;
    		if (/*viewmode*/ ctx[0] == 'about') return 1;
    		if (/*viewmode*/ ctx[0] == "Contact") return 2;
    		if (/*viewmode*/ ctx[0] == "Post") return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			html = element("html");
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
    			title.textContent = "Clean Blog - Start Bootstrap Theme";
    			t5 = space();
    			link0 = element("link");
    			t6 = space();
    			script0 = element("script");
    			t7 = space();
    			link1 = element("link");
    			t8 = space();
    			link2 = element("link");
    			t9 = space();
    			link3 = element("link");
    			t10 = space();
    			body = element("body");
    			nav = element("nav");
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "Start Bootstrap";
    			t12 = space();
    			button = element("button");
    			t13 = text("Menu\n                    ");
    			i0 = element("i");
    			t14 = space();
    			div0 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "Home";
    			t16 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "About";
    			t18 = space();
    			li2 = element("li");
    			a3 = element("a");
    			a3.textContent = "Sample Post";
    			t20 = space();
    			li3 = element("li");
    			a4 = element("a");
    			a4.textContent = "Contact";
    			t22 = space();
    			if (if_block) if_block.c();
    			t23 = space();
    			footer = element("footer");
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			ul1 = element("ul");
    			li4 = element("li");
    			a5 = element("a");
    			span0 = element("span");
    			i1 = element("i");
    			t24 = space();
    			i2 = element("i");
    			t25 = space();
    			li5 = element("li");
    			a6 = element("a");
    			span1 = element("span");
    			i3 = element("i");
    			t26 = space();
    			i4 = element("i");
    			t27 = space();
    			li6 = element("li");
    			a7 = element("a");
    			span2 = element("span");
    			i5 = element("i");
    			t28 = space();
    			i6 = element("i");
    			t29 = space();
    			div2 = element("div");
    			div2.textContent = "Copyright © Your Website 2022";
    			t31 = space();
    			script1 = element("script");
    			t32 = space();
    			script2 = element("script");
    			attr_dev(meta0, "charset", "utf-8");
    			add_location(meta0, file, 9, 8, 226);
    			attr_dev(meta1, "name", "viewport");
    			attr_dev(meta1, "content", "width=device-width, initial-scale=1, shrink-to-fit=no");
    			add_location(meta1, file, 10, 8, 259);
    			attr_dev(meta2, "name", "description");
    			attr_dev(meta2, "content", "");
    			add_location(meta2, file, 11, 8, 356);
    			attr_dev(meta3, "name", "author");
    			attr_dev(meta3, "content", "");
    			add_location(meta3, file, 12, 8, 403);
    			add_location(title, file, 13, 8, 445);
    			attr_dev(link0, "rel", "icon");
    			attr_dev(link0, "type", "image/x-icon");
    			attr_dev(link0, "href", "assets/favicon.ico");
    			add_location(link0, file, 14, 8, 503);
    			if (!src_url_equal(script0.src, script0_src_value = "https://use.fontawesome.com/releases/v6.1.0/js/all.js")) attr_dev(script0, "src", script0_src_value);
    			attr_dev(script0, "crossorigin", "anonymous");
    			add_location(script0, file, 16, 8, 627);
    			attr_dev(link1, "href", "https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic");
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "type", "text/css");
    			add_location(link1, file, 18, 8, 766);
    			attr_dev(link2, "href", "https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800");
    			attr_dev(link2, "rel", "stylesheet");
    			attr_dev(link2, "type", "text/css");
    			add_location(link2, file, 19, 8, 896);
    			attr_dev(link3, "href", "./css/styles.css");
    			attr_dev(link3, "rel", "stylesheet");
    			add_location(link3, file, 21, 8, 1125);
    			add_location(head, file, 8, 4, 211);
    			attr_dev(a0, "class", "navbar-brand");
    			attr_dev(a0, "href", "index.html");
    			add_location(a0, file, 27, 16, 1362);
    			attr_dev(i0, "class", "fas fa-bars");
    			add_location(i0, file, 30, 20, 1678);
    			attr_dev(button, "class", "navbar-toggler");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", "#navbarResponsive");
    			attr_dev(button, "aria-controls", "navbarResponsive");
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-label", "Toggle navigation");
    			add_location(button, file, 28, 16, 1440);
    			attr_dev(a1, "class", "nav-link px-lg-3 py-3 py-lg-4");
    			attr_dev(a1, "href", "#");
    			add_location(a1, file, 34, 45, 1919);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file, 34, 24, 1898);
    			attr_dev(a2, "class", "nav-link px-lg-3 py-3 py-lg-4");
    			attr_dev(a2, "href", "#");
    			add_location(a2, file, 35, 45, 2062);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file, 35, 24, 2041);
    			attr_dev(a3, "class", "nav-link px-lg-3 py-3 py-lg-4");
    			attr_dev(a3, "href", "#");
    			add_location(a3, file, 36, 45, 2207);
    			attr_dev(li2, "class", "nav-item");
    			add_location(li2, file, 36, 24, 2186);
    			attr_dev(a4, "class", "nav-link px-lg-3 py-3 py-lg-4");
    			attr_dev(a4, "href", "#");
    			add_location(a4, file, 37, 45, 2357);
    			attr_dev(li3, "class", "nav-item");
    			add_location(li3, file, 37, 24, 2336);
    			attr_dev(ul0, "class", "navbar-nav ms-auto py-4 py-lg-0");
    			add_location(ul0, file, 33, 20, 1829);
    			attr_dev(div0, "class", "collapse navbar-collapse");
    			attr_dev(div0, "id", "navbarResponsive");
    			add_location(div0, file, 32, 16, 1748);
    			attr_dev(div1, "class", "container px-4 px-lg-5");
    			add_location(div1, file, 26, 12, 1309);
    			attr_dev(nav, "class", "navbar navbar-expand-lg navbar-light");
    			attr_dev(nav, "id", "mainNav");
    			add_location(nav, file, 25, 8, 1233);
    			attr_dev(i1, "class", "fas fa-circle fa-stack-2x");
    			add_location(i1, file, 63, 40, 3287);
    			attr_dev(i2, "class", "fab fa-twitter fa-stack-1x fa-inverse");
    			add_location(i2, file, 64, 40, 3369);
    			attr_dev(span0, "class", "fa-stack fa-lg");
    			add_location(span0, file, 62, 36, 3217);
    			attr_dev(a5, "href", "https://twitter.com/presan100");
    			add_location(a5, file, 61, 32, 3140);
    			attr_dev(li4, "class", "list-inline-item");
    			add_location(li4, file, 60, 28, 3078);
    			attr_dev(i3, "class", "fas fa-circle fa-stack-2x");
    			add_location(i3, file, 71, 40, 3748);
    			attr_dev(i4, "class", "fab fa-facebook-f fa-stack-1x fa-inverse");
    			add_location(i4, file, 72, 40, 3830);
    			attr_dev(span1, "class", "fa-stack fa-lg");
    			add_location(span1, file, 70, 36, 3678);
    			attr_dev(a6, "href", "#!");
    			add_location(a6, file, 69, 32, 3628);
    			attr_dev(li5, "class", "list-inline-item");
    			add_location(li5, file, 68, 28, 3566);
    			attr_dev(i5, "class", "fas fa-circle fa-stack-2x");
    			add_location(i5, file, 79, 40, 4241);
    			attr_dev(i6, "class", "fab fa-github fa-stack-1x fa-inverse");
    			add_location(i6, file, 80, 40, 4323);
    			attr_dev(span2, "class", "fa-stack fa-lg");
    			add_location(span2, file, 78, 36, 4171);
    			attr_dev(a7, "href", "https://github.com/LuticaCANARD");
    			add_location(a7, file, 77, 32, 4092);
    			attr_dev(li6, "class", "list-inline-item");
    			add_location(li6, file, 76, 28, 4030);
    			attr_dev(ul1, "class", "list-inline text-center");
    			add_location(ul1, file, 59, 24, 3013);
    			attr_dev(div2, "class", "small text-center text-muted fst-italic");
    			add_location(div2, file, 85, 24, 4545);
    			attr_dev(div3, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div3, file, 58, 20, 2947);
    			attr_dev(div4, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div4, file, 57, 16, 2873);
    			attr_dev(div5, "class", "container px-4 px-lg-5");
    			add_location(div5, file, 56, 12, 2820);
    			attr_dev(footer, "class", "border-top");
    			add_location(footer, file, 55, 8, 2780);
    			if (!src_url_equal(script1.src, script1_src_value = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file, 91, 8, 4768);
    			if (!src_url_equal(script2.src, script2_src_value = "./js/scripts.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file, 93, 8, 4907);
    			add_location(body, file, 23, 4, 1191);
    			attr_dev(html, "lang", "en");
    			add_location(html, file, 7, 0, 190);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, html, anchor);
    			append_dev(html, head);
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
    			append_dev(head, script0);
    			append_dev(head, t7);
    			append_dev(head, link1);
    			append_dev(head, t8);
    			append_dev(head, link2);
    			append_dev(head, t9);
    			append_dev(head, link3);
    			append_dev(html, t10);
    			append_dev(html, body);
    			append_dev(body, nav);
    			append_dev(nav, div1);
    			append_dev(div1, a0);
    			append_dev(div1, t12);
    			append_dev(div1, button);
    			append_dev(button, t13);
    			append_dev(button, i0);
    			append_dev(div1, t14);
    			append_dev(div1, div0);
    			append_dev(div0, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, a1);
    			append_dev(ul0, t16);
    			append_dev(ul0, li1);
    			append_dev(li1, a2);
    			append_dev(ul0, t18);
    			append_dev(ul0, li2);
    			append_dev(li2, a3);
    			append_dev(ul0, t20);
    			append_dev(ul0, li3);
    			append_dev(li3, a4);
    			append_dev(body, t22);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(body, null);
    			}

    			append_dev(body, t23);
    			append_dev(body, footer);
    			append_dev(footer, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, ul1);
    			append_dev(ul1, li4);
    			append_dev(li4, a5);
    			append_dev(a5, span0);
    			append_dev(span0, i1);
    			append_dev(span0, t24);
    			append_dev(span0, i2);
    			append_dev(ul1, t25);
    			append_dev(ul1, li5);
    			append_dev(li5, a6);
    			append_dev(a6, span1);
    			append_dev(span1, i3);
    			append_dev(span1, t26);
    			append_dev(span1, i4);
    			append_dev(ul1, t27);
    			append_dev(ul1, li6);
    			append_dev(li6, a7);
    			append_dev(a7, span2);
    			append_dev(span2, i5);
    			append_dev(span2, t28);
    			append_dev(span2, i6);
    			append_dev(div3, t29);
    			append_dev(div3, div2);
    			append_dev(body, t31);
    			append_dev(body, script1);
    			append_dev(body, t32);
    			append_dev(body, script2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a1, "click", /*click_handler*/ ctx[1], false, false, false),
    					listen_dev(a2, "click", /*click_handler_1*/ ctx[2], false, false, false),
    					listen_dev(a3, "click", /*click_handler_2*/ ctx[3], false, false, false),
    					listen_dev(a4, "click", /*click_handler_3*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
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
    					}

    					transition_in(if_block, 1);
    					if_block.m(body, t23);
    				} else {
    					if_block = null;
    				}
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
    			if (detaching) detach_dev(html);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

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
    	let viewmode = "Home";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, viewmode = "Home");
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, viewmode = "about");
    	};

    	const click_handler_2 = () => {
    		$$invalidate(0, viewmode = "Post");
    	};

    	const click_handler_3 = () => {
    		$$invalidate(0, viewmode = "Contact");
    	};

    	$$self.$capture_state = () => ({ viewmode, Mainview: Main, About, Contact, Post });

    	$$self.$inject_state = $$props => {
    		if ('viewmode' in $$props) $$invalidate(0, viewmode = $$props.viewmode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [viewmode, click_handler, click_handler_1, click_handler_2, click_handler_3];
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
