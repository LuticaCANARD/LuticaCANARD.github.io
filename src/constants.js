
/**
 * @description 모바일의 최대넓이를 규정하는 상수.
 */
export const MOBILE_HEADER_WIDTH = Number(window.getComputedStyle(document.body).getPropertyValue('--main-max-width').split('px')[0]);

export const MOBILE_MAX_WIDTH = Number(window.getComputedStyle(document.body).getPropertyValue('--mobile-max-width').split('px')[0]);