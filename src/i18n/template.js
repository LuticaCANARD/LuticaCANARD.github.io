/**
 * @typedef {{
 *  "title" : string,
 *  "subtitle"? : string,
 * }} IntroTemplate
 * @typedef {{
 *      [K in string] : string 
 * }} ParagraphTemplate
 * @typedef {{
 * "contact": {
 *      "toemail" : string,
 * } & IntroTemplate & ParagraphTemplate
 * }} ContactTemplate
 * 
 * @typedef {{
 * "settings" :{
 *      "darkMode" : string
 * },
 * }
 * } SettingsTemplate
 * 
 * @typedef {ContactTemplate & SettingsTemplate & any} TranslateTemplate
 */