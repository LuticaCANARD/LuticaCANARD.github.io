import { writable } from 'svelte/store';

const darkmode = writable(null);
const displayLanguage = writable('');


export {darkmode, displayLanguage};