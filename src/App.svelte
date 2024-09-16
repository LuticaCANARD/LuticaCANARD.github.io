
<script>

import { onMount } from 'svelte';
import Router from 'svelte-spa-router';
import { darkmode } from './store.js';
import Header from './lib/global/header.svelte';
import routes from './lib/routers/route.js';
import Footer from './lib/global/footer.svelte';
import('./i18n.js');
import { _  as i18,isLoading } from 'svelte-i18n'

// 다크모드 선호 조사.
let prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
let darkmode_onoff = prefersDarkMode ? "dark":"light"


// 다크모드 변경시 이벤트
darkmode.subscribe((darkmode) => { 
    if(darkmode==undefined){
        darkmode=prefersDarkMode
    }
    else{
        prefersDarkMode=darkmode
    }
    changeTheme()
})

// root에 다크모드 적용
function changeTheme() {
    if (prefersDarkMode) 
    {
        // Dark mode on
        document.body.style.background = '#171718';
        document.body.style.color = 'white';
        document.body.style.setProperty('--dark-back-ground', 'black')
        document.body.style.setProperty('--dark-text', 'white')
    }
    else
    {
        // Dark mode off
        document.body.style.background = 'rgb(200, 200, 200)'
        document.body.style.color = 'black'
        document.body.style.setProperty('--dark-back-ground', 'white')
        document.body.style.setProperty('--dark-text', 'black')
    }
    darkmode_onoff = prefersDarkMode ? "dark":"light"
}
import { params } from "svelte-spa-router";
const id = params

let postmode;
let url = ``;
onMount(() => {
    
});



</script>
<svelte:head>
    <title>Lutica's bar</title>
</svelte:head>
{#if $isLoading}
    <div>Loading...</div>
{:else}
    {#key darkmode_onoff}
    <Header/>
    <main>
        <Router routes={routes}/>
    </main>
    <Footer/>
    {/key}
{/if}
