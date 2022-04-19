
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

    var posts = [
    	{
    		Link: "../asserts/posts/first.html",
    		piclink: "../img/post-bg.jpg",
    		title: "story",
    		subtitle: "about Lu",
    		date: "1999.08.21",
    		headlink: "../assets/posts/first.html"
    	}
    ];

    /* src\main.svelte generated by Svelte v3.47.0 */
    const file$4 = "src\\main.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i].Link;
    	child_ctx[1] = list[i].piclink;
    	child_ctx[2] = list[i].title;
    	child_ctx[3] = list[i].subtitle;
    	child_ctx[4] = list[i].date;
    	child_ctx[5] = list[i].headlink;
    	child_ctx[7] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i].Link;
    	child_ctx[1] = list[i].piclink;
    	child_ctx[2] = list[i].title;
    	child_ctx[3] = list[i].subtitle;
    	child_ctx[4] = list[i].date;
    	child_ctx[5] = list[i].headlink;
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (17:0) {#each posters as {Link,piclink,title,subtitle,date,headlink}
    function create_each_block_1(ctx) {
    	let t0;
    	let script;

    	const block = {
    		c: function create() {
    			t0 = text("}\r\n");
    			script = element("script");
    			script.textContent = "function Click()\r\n{\r\n    GL_Link = {Link};\r\n    GL_piclink = {GL_piclink};\r\n    GL_headlink = {headlink};\r\n}\r\n";
    			add_location(script, file$4, 17, 0, 692);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, script, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(script);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(17:0) {#each posters as {Link,piclink,title,subtitle,date,headlink}",
    		ctx
    	});

    	return block;
    }

    // (32:12) {#each posters as {Link,piclink,title,subtitle,date,headlink}
    function create_each_block(ctx) {
    	let t0;
    	let div;
    	let a0;
    	let h2;
    	let t1_value = /*title*/ ctx[2] + "";
    	let t1;
    	let t2;
    	let h3;
    	let t3_value = /*subtitle*/ ctx[3] + "";
    	let t3;
    	let t4;
    	let p;
    	let t5;
    	let a1;
    	let t7;
    	let t8_value = /*date*/ ctx[4] + "";
    	let t8;
    	let t9;
    	let hr;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("}\r\n            ");
    			div = element("div");
    			a0 = element("a");
    			h2 = element("h2");
    			t1 = text(t1_value);
    			t2 = space();
    			h3 = element("h3");
    			t3 = text(t3_value);
    			t4 = space();
    			p = element("p");
    			t5 = text("Posted by\r\n                    ");
    			a1 = element("a");
    			a1.textContent = "Lutica";
    			t7 = text("\r\n                    on ");
    			t8 = text(t8_value);
    			t9 = space();
    			hr = element("hr");
    			attr_dev(h2, "class", "post-title");
    			add_location(h2, file$4, 34, 20, 1224);
    			attr_dev(h3, "class", "post-subtitle");
    			add_location(h3, file$4, 35, 20, 1281);
    			attr_dev(a0, "href", "#");
    			add_location(a0, file$4, 33, 16, 1173);
    			attr_dev(a1, "href", "#!");
    			add_location(a1, file$4, 39, 20, 1436);
    			attr_dev(p, "class", "post-meta");
    			add_location(p, file$4, 37, 16, 1362);
    			attr_dev(div, "class", "post-preview");
    			add_location(div, file$4, 32, 12, 1129);
    			attr_dev(hr, "class", "my-4");
    			add_location(hr, file$4, 44, 12, 1575);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, a0);
    			append_dev(a0, h2);
    			append_dev(h2, t1);
    			append_dev(a0, t2);
    			append_dev(a0, h3);
    			append_dev(h3, t3);
    			append_dev(div, t4);
    			append_dev(div, p);
    			append_dev(p, t5);
    			append_dev(p, a1);
    			append_dev(p, t7);
    			append_dev(p, t8);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, hr, anchor);

    			if (!mounted) {
    				dispose = listen_dev(a0, "click", Click, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(hr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(32:12) {#each posters as {Link,piclink,title,subtitle,date,headlink}",
    		ctx
    	});

    	return block;
    }

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
    	let t4;
    	let div7;
    	let div6;
    	let div5;
    	let t5;
    	let div4;
    	let a;
    	let each_value_1 = posters;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = posters;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			header = element("header");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Lutica's blog";
    			t1 = space();
    			span = element("span");
    			span.textContent = "A journey to find brilliant story.";
    			t3 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div4 = element("div");
    			a = element("a");
    			a.textContent = "Older Posts →";
    			add_location(h1, file$4, 9, 20, 429);
    			attr_dev(span, "class", "subheading");
    			add_location(span, file$4, 10, 20, 473);
    			attr_dev(div0, "class", "site-heading");
    			add_location(div0, file$4, 8, 16, 381);
    			attr_dev(div1, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div1, file$4, 7, 12, 322);
    			attr_dev(div2, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div2, file$4, 6, 8, 255);
    			attr_dev(div3, "class", "container position-relative px-4 px-lg-5");
    			add_location(div3, file$4, 5, 4, 191);
    			attr_dev(header, "class", "masthead");
    			set_style(header, "background-image", "url('../assets/img/home-bg.jpg')");
    			add_location(header, file$4, 4, 4, 101);
    			attr_dev(a, "class", "btn btn-primary text-uppercase");
    			attr_dev(a, "href", "#!");
    			add_location(a, file$4, 48, 57, 1703);
    			attr_dev(div4, "class", "d-flex justify-content-end mb-4");
    			add_location(div4, file$4, 48, 12, 1658);
    			attr_dev(div5, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div5, file$4, 29, 8, 961);
    			attr_dev(div6, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div6, file$4, 28, 4, 898);
    			attr_dev(div7, "class", "container px-4 px-lg-5");
    			add_location(div7, file$4, 27, 1, 856);
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

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(target, anchor);
    			}

    			insert_dev(target, t4, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div5, null);
    			}

    			append_dev(div5, t5);
    			append_dev(div5, div4);
    			append_dev(div4, a);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*posters, Click*/ 0) {
    				each_value = posters;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div5, t5);
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
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t3);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div7);
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
    	validate_slots('Main', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ posts });
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
    			add_location(h1, file$3, 5, 20, 329);
    			attr_dev(span, "class", "subheading");
    			add_location(span, file$3, 6, 20, 368);
    			attr_dev(div0, "class", "page-heading");
    			add_location(div0, file$3, 4, 16, 281);
    			attr_dev(div1, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div1, file$3, 3, 12, 222);
    			attr_dev(div2, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div2, file$3, 2, 8, 155);
    			attr_dev(div3, "class", "container position-relative px-4 px-lg-5");
    			add_location(div3, file$3, 1, 4, 91);
    			attr_dev(header, "class", "masthead");
    			set_style(header, "background-image", "url('../assets/img/about-bg.jpg')");
    			add_location(header, file$3, 0, 0, 0);
    			add_location(p0, file$3, 17, 16, 722);
    			add_location(p1, file$3, 18, 16, 958);
    			add_location(p2, file$3, 19, 16, 1221);
    			attr_dev(div4, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div4, file$3, 16, 12, 663);
    			attr_dev(div5, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div5, file$3, 15, 8, 596);
    			attr_dev(div6, "class", "container px-4 px-lg-5");
    			add_location(div6, file$3, 14, 4, 550);
    			attr_dev(main, "class", "mb-4");
    			add_location(main, file$3, 13, 0, 525);
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
    			add_location(h1, file$2, 5, 20, 331);
    			attr_dev(span, "class", "subheading");
    			add_location(span, file$2, 6, 20, 372);
    			attr_dev(div0, "class", "page-heading");
    			add_location(div0, file$2, 4, 16, 283);
    			attr_dev(div1, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div1, file$2, 3, 12, 224);
    			attr_dev(div2, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div2, file$2, 2, 8, 157);
    			attr_dev(div3, "class", "container position-relative px-4 px-lg-5");
    			add_location(div3, file$2, 1, 4, 93);
    			attr_dev(header, "class", "masthead");
    			set_style(header, "background-image", "url('../assets/img/contact-bg.jpg')");
    			add_location(header, file$2, 0, 0, 0);
    			add_location(p, file$2, 17, 16, 739);
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Enter your name...");
    			attr_dev(input0, "data-sb-validations", "required");
    			add_location(input0, file$2, 28, 28, 1507);
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$2, 29, 28, 1653);
    			attr_dev(div4, "class", "invalid-feedback");
    			attr_dev(div4, "data-sb-feedback", "name:required");
    			add_location(div4, file$2, 30, 28, 1713);
    			attr_dev(div5, "class", "form-floating");
    			add_location(div5, file$2, 27, 24, 1450);
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "id", "email");
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "placeholder", "Enter your email...");
    			attr_dev(input1, "data-sb-validations", "required,email");
    			add_location(input1, file$2, 33, 28, 1916);
    			attr_dev(label1, "for", "email");
    			add_location(label1, file$2, 34, 28, 2071);
    			attr_dev(div6, "class", "invalid-feedback");
    			attr_dev(div6, "data-sb-feedback", "email:required");
    			add_location(div6, file$2, 35, 28, 2141);
    			attr_dev(div7, "class", "invalid-feedback");
    			attr_dev(div7, "data-sb-feedback", "email:email");
    			add_location(div7, file$2, 36, 28, 2262);
    			attr_dev(div8, "class", "form-floating");
    			add_location(div8, file$2, 32, 24, 1859);
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "id", "phone");
    			attr_dev(input2, "type", "tel");
    			attr_dev(input2, "placeholder", "Enter your phone number...");
    			attr_dev(input2, "data-sb-validations", "required");
    			add_location(input2, file$2, 39, 28, 2463);
    			attr_dev(label2, "for", "phone");
    			add_location(label2, file$2, 40, 28, 2617);
    			attr_dev(div9, "class", "invalid-feedback");
    			attr_dev(div9, "data-sb-feedback", "phone:required");
    			add_location(div9, file$2, 41, 28, 2686);
    			attr_dev(div10, "class", "form-floating");
    			add_location(div10, file$2, 38, 24, 2406);
    			attr_dev(textarea, "class", "form-control");
    			attr_dev(textarea, "id", "message");
    			attr_dev(textarea, "placeholder", "Enter your message here...");
    			set_style(textarea, "height", "12rem");
    			attr_dev(textarea, "data-sb-validations", "required");
    			add_location(textarea, file$2, 44, 28, 2898);
    			attr_dev(label3, "for", "message");
    			add_location(label3, file$2, 45, 28, 3077);
    			attr_dev(div11, "class", "invalid-feedback");
    			attr_dev(div11, "data-sb-feedback", "message:required");
    			add_location(div11, file$2, 46, 28, 3143);
    			attr_dev(div12, "class", "form-floating");
    			add_location(div12, file$2, 43, 24, 2841);
    			add_location(br0, file$2, 48, 24, 3295);
    			attr_dev(div13, "class", "fw-bolder");
    			add_location(div13, file$2, 55, 32, 3696);
    			add_location(br1, file$2, 57, 32, 3853);
    			attr_dev(a, "href", "https://startbootstrap.com/solution/contact-forms");
    			add_location(a, file$2, 58, 32, 3893);
    			attr_dev(div14, "class", "text-center mb-3");
    			add_location(div14, file$2, 54, 28, 3632);
    			attr_dev(div15, "class", "d-none");
    			attr_dev(div15, "id", "submitSuccessMessage");
    			add_location(div15, file$2, 53, 24, 3556);
    			attr_dev(div16, "class", "text-center text-danger mb-3");
    			add_location(div16, file$2, 65, 68, 4373);
    			attr_dev(div17, "class", "d-none");
    			attr_dev(div17, "id", "submitErrorMessage");
    			add_location(div17, file$2, 65, 24, 4329);
    			attr_dev(button, "class", "btn btn-primary text-uppercase disabled");
    			attr_dev(button, "id", "submitButton");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$2, 67, 24, 4522);
    			attr_dev(form, "id", "contactForm");
    			attr_dev(form, "data-sb-form-api-token", "API_TOKEN");
    			add_location(form, file$2, 26, 20, 1366);
    			attr_dev(div18, "class", "my-5");
    			add_location(div18, file$2, 18, 16, 878);
    			attr_dev(div19, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div19, file$2, 16, 12, 680);
    			attr_dev(div20, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div20, file$2, 15, 8, 613);
    			attr_dev(div21, "class", "container px-4 px-lg-5");
    			add_location(div21, file$2, 14, 4, 567);
    			attr_dev(main, "class", "mb-4");
    			add_location(main, file$2, 13, 0, 542);
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
    	let t;
    	let article;
    	let div6;
    	let div5;
    	let div4;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			article = element("article");
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			attr_dev(div0, "class", "post-heading");
    			add_location(div0, file$1, 13, 16, 417);
    			attr_dev(div1, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div1, file$1, 12, 12, 358);
    			attr_dev(div2, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div2, file$1, 11, 8, 291);
    			attr_dev(div3, "class", "container position-relative px-4 px-lg-5");
    			add_location(div3, file$1, 10, 4, 227);
    			attr_dev(header, "class", "masthead");
    			set_style(header, "background-image", "url('" + /*piclink*/ ctx[0] + "')");
    			add_location(header, file$1, 9, 0, 153);
    			attr_dev(div4, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div4, file$1, 24, 12, 725);
    			attr_dev(div5, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div5, file$1, 23, 8, 658);
    			attr_dev(div6, "class", "container px-4 px-lg-5");
    			add_location(div6, file$1, 22, 4, 612);
    			attr_dev(article, "class", "mb-4");
    			add_location(article, file$1, 21, 0, 584);
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
    			div0.innerHTML = headhtml;
    			insert_dev(target, t, anchor);
    			insert_dev(target, article, anchor);
    			append_dev(article, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			div4.innerHTML = linkhtml;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*piclink*/ 1) {
    				set_style(header, "background-image", "url('" + /*piclink*/ ctx[0] + "')");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t);
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
    	let { SL_headlink } = $$props;
    	let { piclink } = $$props;
    	headhtml = SL_headlink;
    	linkhtml = Link;
    	const writable_props = ['Link', 'SL_headlink', 'piclink'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Post> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('Link' in $$props) $$invalidate(1, Link = $$props.Link);
    		if ('SL_headlink' in $$props) $$invalidate(2, SL_headlink = $$props.SL_headlink);
    		if ('piclink' in $$props) $$invalidate(0, piclink = $$props.piclink);
    	};

    	$$self.$capture_state = () => ({ Link, SL_headlink, piclink });

    	$$self.$inject_state = $$props => {
    		if ('Link' in $$props) $$invalidate(1, Link = $$props.Link);
    		if ('SL_headlink' in $$props) $$invalidate(2, SL_headlink = $$props.SL_headlink);
    		if ('piclink' in $$props) $$invalidate(0, piclink = $$props.piclink);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [piclink, Link, SL_headlink];
    }

    class Post extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { Link: 1, SL_headlink: 2, piclink: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Post",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*Link*/ ctx[1] === undefined && !('Link' in props)) {
    			console.warn("<Post> was created without expected prop 'Link'");
    		}

    		if (/*SL_headlink*/ ctx[2] === undefined && !('SL_headlink' in props)) {
    			console.warn("<Post> was created without expected prop 'SL_headlink'");
    		}

    		if (/*piclink*/ ctx[0] === undefined && !('piclink' in props)) {
    			console.warn("<Post> was created without expected prop 'piclink'");
    		}
    	}

    	get Link() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Link(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get SL_headlink() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set SL_headlink(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get piclink() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set piclink(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.47.0 */
    const file = "src\\App.svelte";

    // (52:31) 
    function create_if_block_3(ctx) {
    	let post;
    	let current;

    	post = new Post({
    			props: {
    				Link: "" + (/*GL_headlink*/ ctx[2] + ";"),
    				piclink: "" + (/*GL_piclink*/ ctx[1] + ";"),
    				headlink: "" + (/*GL_headlink*/ ctx[2] + ";")
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(post.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(post, target, anchor);
    			current = true;
    		},
    		p: noop,
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
    		source: "(52:31) ",
    		ctx
    	});

    	return block;
    }

    // (50:34) 
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
    		p: noop,
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
    		source: "(50:34) ",
    		ctx
    	});

    	return block;
    }

    // (48:34) 
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
    		p: noop,
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
    		source: "(48:34) ",
    		ctx
    	});

    	return block;
    }

    // (46:2) {#if (viewmode == 'Home') }
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
    		p: noop,
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
    		source: "(46:2) {#if (viewmode == 'Home') }",
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
    			add_location(meta0, file, 12, 8, 287);
    			attr_dev(meta1, "name", "viewport");
    			attr_dev(meta1, "content", "width=device-width, initial-scale=1, shrink-to-fit=no");
    			add_location(meta1, file, 13, 8, 320);
    			attr_dev(meta2, "name", "description");
    			attr_dev(meta2, "content", "");
    			add_location(meta2, file, 14, 8, 417);
    			attr_dev(meta3, "name", "author");
    			attr_dev(meta3, "content", "");
    			add_location(meta3, file, 15, 8, 464);
    			add_location(title, file, 16, 8, 506);
    			attr_dev(link0, "rel", "icon");
    			attr_dev(link0, "type", "image/x-icon");
    			attr_dev(link0, "href", "../assets/favicon.ico");
    			add_location(link0, file, 17, 8, 564);
    			if (!src_url_equal(script0.src, script0_src_value = "https://use.fontawesome.com/releases/v6.1.0/js/all.js")) attr_dev(script0, "src", script0_src_value);
    			attr_dev(script0, "crossorigin", "anonymous");
    			add_location(script0, file, 19, 8, 691);
    			attr_dev(link1, "href", "https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic");
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "type", "text/css");
    			add_location(link1, file, 21, 8, 830);
    			attr_dev(link2, "href", "https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800");
    			attr_dev(link2, "rel", "stylesheet");
    			attr_dev(link2, "type", "text/css");
    			add_location(link2, file, 22, 8, 960);
    			attr_dev(link3, "href", "/css/styles.css");
    			attr_dev(link3, "rel", "stylesheet");
    			add_location(link3, file, 24, 8, 1189);
    			add_location(head, file, 11, 4, 272);
    			attr_dev(a0, "class", "navbar-brand");
    			attr_dev(a0, "href", "index.html");
    			add_location(a0, file, 30, 16, 1425);
    			attr_dev(i0, "class", "fas fa-bars");
    			add_location(i0, file, 33, 20, 1741);
    			attr_dev(button, "class", "navbar-toggler");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", "#navbarResponsive");
    			attr_dev(button, "aria-controls", "navbarResponsive");
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-label", "Toggle navigation");
    			add_location(button, file, 31, 16, 1503);
    			attr_dev(a1, "class", "nav-link px-lg-3 py-3 py-lg-4");
    			attr_dev(a1, "href", "#");
    			add_location(a1, file, 37, 45, 1982);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file, 37, 24, 1961);
    			attr_dev(a2, "class", "nav-link px-lg-3 py-3 py-lg-4");
    			attr_dev(a2, "href", "#");
    			add_location(a2, file, 38, 45, 2125);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file, 38, 24, 2104);
    			attr_dev(a3, "class", "nav-link px-lg-3 py-3 py-lg-4");
    			attr_dev(a3, "href", "#");
    			add_location(a3, file, 39, 45, 2270);
    			attr_dev(li2, "class", "nav-item");
    			add_location(li2, file, 39, 24, 2249);
    			attr_dev(a4, "class", "nav-link px-lg-3 py-3 py-lg-4");
    			attr_dev(a4, "href", "#");
    			add_location(a4, file, 40, 45, 2420);
    			attr_dev(li3, "class", "nav-item");
    			add_location(li3, file, 40, 24, 2399);
    			attr_dev(ul0, "class", "navbar-nav ms-auto py-4 py-lg-0");
    			add_location(ul0, file, 36, 20, 1892);
    			attr_dev(div0, "class", "collapse navbar-collapse");
    			attr_dev(div0, "id", "navbarResponsive");
    			add_location(div0, file, 35, 16, 1811);
    			attr_dev(div1, "class", "container px-4 px-lg-5");
    			add_location(div1, file, 29, 12, 1372);
    			attr_dev(nav, "class", "navbar navbar-expand-lg navbar-light");
    			attr_dev(nav, "id", "mainNav");
    			add_location(nav, file, 28, 8, 1296);
    			attr_dev(i1, "class", "fas fa-circle fa-stack-2x");
    			add_location(i1, file, 68, 40, 3431);
    			attr_dev(i2, "class", "fab fa-twitter fa-stack-1x fa-inverse");
    			add_location(i2, file, 69, 40, 3513);
    			attr_dev(span0, "class", "fa-stack fa-lg");
    			add_location(span0, file, 67, 36, 3361);
    			attr_dev(a5, "href", "https://twitter.com/presan100");
    			add_location(a5, file, 66, 32, 3284);
    			attr_dev(li4, "class", "list-inline-item");
    			add_location(li4, file, 65, 28, 3222);
    			attr_dev(i3, "class", "fas fa-circle fa-stack-2x");
    			add_location(i3, file, 76, 40, 3892);
    			attr_dev(i4, "class", "fab fa-facebook-f fa-stack-1x fa-inverse");
    			add_location(i4, file, 77, 40, 3974);
    			attr_dev(span1, "class", "fa-stack fa-lg");
    			add_location(span1, file, 75, 36, 3822);
    			attr_dev(a6, "href", "#!");
    			add_location(a6, file, 74, 32, 3772);
    			attr_dev(li5, "class", "list-inline-item");
    			add_location(li5, file, 73, 28, 3710);
    			attr_dev(i5, "class", "fas fa-circle fa-stack-2x");
    			add_location(i5, file, 84, 40, 4385);
    			attr_dev(i6, "class", "fab fa-github fa-stack-1x fa-inverse");
    			add_location(i6, file, 85, 40, 4467);
    			attr_dev(span2, "class", "fa-stack fa-lg");
    			add_location(span2, file, 83, 36, 4315);
    			attr_dev(a7, "href", "https://github.com/LuticaCANARD");
    			add_location(a7, file, 82, 32, 4236);
    			attr_dev(li6, "class", "list-inline-item");
    			add_location(li6, file, 81, 28, 4174);
    			attr_dev(ul1, "class", "list-inline text-center");
    			add_location(ul1, file, 64, 24, 3157);
    			attr_dev(div2, "class", "small text-center text-muted fst-italic");
    			add_location(div2, file, 90, 24, 4689);
    			attr_dev(div3, "class", "col-md-10 col-lg-8 col-xl-7");
    			add_location(div3, file, 63, 20, 3091);
    			attr_dev(div4, "class", "row gx-4 gx-lg-5 justify-content-center");
    			add_location(div4, file, 62, 16, 3017);
    			attr_dev(div5, "class", "container px-4 px-lg-5");
    			add_location(div5, file, 61, 12, 2964);
    			attr_dev(footer, "class", "border-top");
    			add_location(footer, file, 60, 8, 2924);
    			if (!src_url_equal(script1.src, script1_src_value = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file, 96, 8, 4912);
    			if (!src_url_equal(script2.src, script2_src_value = "../js/scripts.js")) attr_dev(script2, "src", script2_src_value);
    			add_location(script2, file, 98, 8, 5051);
    			add_location(body, file, 26, 4, 1254);
    			attr_dev(html, "lang", "en");
    			add_location(html, file, 10, 0, 251);
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
    					listen_dev(a1, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(a2, "click", /*click_handler_1*/ ctx[4], false, false, false),
    					listen_dev(a3, "click", /*click_handler_2*/ ctx[5], false, false, false),
    					listen_dev(a4, "click", /*click_handler_3*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
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
    	let viewmode = "Contant";
    	let GL_Link;
    	let GL_piclink;
    	let GL_headlink;
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

    	$$self.$capture_state = () => ({
    		viewmode,
    		Mainview: Main,
    		About,
    		Contact,
    		Post,
    		GL_Link,
    		GL_piclink,
    		GL_headlink
    	});

    	$$self.$inject_state = $$props => {
    		if ('viewmode' in $$props) $$invalidate(0, viewmode = $$props.viewmode);
    		if ('GL_Link' in $$props) GL_Link = $$props.GL_Link;
    		if ('GL_piclink' in $$props) $$invalidate(1, GL_piclink = $$props.GL_piclink);
    		if ('GL_headlink' in $$props) $$invalidate(2, GL_headlink = $$props.GL_headlink);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		viewmode,
    		GL_piclink,
    		GL_headlink,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
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
