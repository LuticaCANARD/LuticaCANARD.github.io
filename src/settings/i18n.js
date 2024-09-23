// GUIDE : https://github.com/kaisermann/svelte-i18n/blob/HEAD/docs/Getting%20Started.md
import { addMessages,init,getLocaleFromNavigator } from 'svelte-i18n';
import ko from '../i18n/ko';
import en from '../i18n/en';

export default ()=>{
    addMessages('ko', ko);
    addMessages('en', en);
    const supportedLanguages = ['ko', 'en'];
    let userLang = getLocaleFromNavigator();
    if(!userLang){
        userLang = 'ko';
    }
    if(!supportedLanguages.includes(userLang)){
        userLang = userLang.split('-')[0];
    }

    init({
        fallbackLocale: 'ko',
        initialLocale: userLang,
    })
} 