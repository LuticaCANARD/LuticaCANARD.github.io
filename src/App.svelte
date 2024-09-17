
<script>

import { onMount } from 'svelte';
import Router from 'svelte-spa-router';
import { darkmode } from './store.js';
import Header from './lib/global/header.svelte';
import routes from './lib/routers/route.js';
import Footer from './lib/global/footer.svelte';
import i18nInit from './i18n.js';
import { _  as i18,isLoading } from 'svelte-i18n'
import { params } from "svelte-spa-router";

// 다크모드 선호 조사.
let prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches


// root에 다크모드 적용
function changeTheme() {
    document.body.setAttribute('is_light',prefersDarkMode ? "dark":"light")
}
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
let loaded = false;
let startLoad = false;
i18nInit();
isLoading.subscribe((loading) => {
    if(loading === true){
        console.log("loading")
        startLoad = true;
    }
    if(loading === false && startLoad === true){
        console.log("loading2")
        loaded = true;
    }
})
onMount(() => {
    
});

</script>
<svelte:head>
    <title>Lutica's bar</title>
</svelte:head>
{#if $isLoading === true}
    <div>
        <p1>Loading...</p1>
    </div>
{:else}
    {#key loaded}
    <Header/>
    <main>
        <Router routes={routes}/>
    </main>
    <Footer/>
    {/key}
{/if}
