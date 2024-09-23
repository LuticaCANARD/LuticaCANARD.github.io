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
 * @typedef {{
 *    "landing" : IntroTemplate
 * }} LandingTemplate
 * 
 * @typedef { ContactTemplate & SettingsTemplate & LandingTemplate & any } TranslateTemplate
 */