import { darkMode } from '../store.js';

export function darkModeInit(){
    // 다크모드 선호 조사.
    let prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    // root에 다크모드 적용
    function changeTheme() {
        document.body.setAttribute('is_light',prefersDarkMode ? "dark":"light")
    }
    darkMode.set(prefersDarkMode)
    // 다크모드 변경시 이벤트
    darkMode.subscribe((darkMode) => { 
        if(darkMode!=undefined){
            prefersDarkMode=darkMode
        }
        changeTheme()
    })
}