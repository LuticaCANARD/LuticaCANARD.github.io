import { writable } from 'svelte/store';

const darkMode = writable(null);
const displayLanguage = writable('');


export {darkMode, displayLanguage};