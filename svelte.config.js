import plugin from "@sveltejs/adapter-static";
import adapter from "@sveltejs/adapter-static"; 
// was "@sveltejs/adapter-auto"
//import css from 'rollup-plugin-css-only';


/** @type {import(""@sveltejs/kit").Config} */
const config = {
    kit: {
        adapter: adapter({
            pages: "docs",
            assets: "docs"
        }),
        paths: {
            // change below to your repo name
            base:""
        },
    }

};

export default config;