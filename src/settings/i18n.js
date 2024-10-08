// GUIDE : https://github.com/kaisermann/svelte-i18n/blob/HEAD/docs/Getting%20Started.md
import { addMessages,init,getLocaleFromNavigator } from 'svelte-i18n';
import ko from '../i18n/ko';
import en from '../i18n/en';

export default ()=>{
    addMessages('ko', ko);
    addMessages('en', en);
    init({
        fallbackLocale: 'ko',
        initialLocale: getLocaleFromNavigator(),
    })
} 