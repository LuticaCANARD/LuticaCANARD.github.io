import i18nInit from './settings/i18n.js';
import { darkModeInit } from './settings/darkmode.js';

export function appInit() {
    darkModeInit();
    i18nInit();
    
}