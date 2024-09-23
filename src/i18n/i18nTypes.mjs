/**
 * @typedef {{
 *  "title" : string,
 *  "subtitle"? : string,
 * }} IntroTemplate
 * @typedef {{
 *      [K in `p${number}`] : string 
 * }} ParagraphTemplate
 * @typedef {{
 *   "toemail" : string,
 * } & IntroTemplate & ParagraphTemplate
 * } ContactTemplate
 * 
 * @typedef {{
 *      "darkMode" : string
 * }
 * } SettingsTemplate
 * 

 * 
 * @typedef {{
 * "home" : {
 *      "main" : string
 *  },
 * "about" : {
 *      "AIData" : string,
 *      "metabus" : string,
 *      "web" : string,
 *      "network" : string,
 *      "main" : string,
 *      "about" : string
 * },
 * "contact" : {
 *      "main" : string
 * },}} MenuTemplate
 * 
 * @typedef {{
 *   "tab-name" : string,
 *   "error404" : string,
 *   "menus" : MenuTemplate,
 *   "about-me" : any, // 자기소개
 *   "about" : any,    // 분야별 소개
 *   "contact" : ContactTemplate,
 *   "settings" : SettingsTemplate,
 *   "landing" : IntroTemplate
 * }} TranslateTemplate
 * 
 */