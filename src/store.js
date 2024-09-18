import { writable } from 'svelte/store';

const darkMode = writable(null);
const displayLanguage = writable('');
const routePath = writable('');

export {darkMode, displayLanguage,routePath};