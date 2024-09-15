
<script>

import { onMount } from 'svelte';
import Router from 'svelte-spa-router';
import { darkmode } from './store.js';
  //path와 라우팅 할 컴포넌트
let prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
let darkmode_onoff = prefersDarkMode?"dark":"light"


darkmode.subscribe((darkmode) => { 
    if(darkmode==undefined){
        darkmode=prefersDarkMode
    }
    else{
        prefersDarkMode=darkmode
    }
    changeTheme()
})

function changeTheme() {
    if (prefersDarkMode) 
    {
        document.body.style.background = '#171718';
        document.body.style.color = 'white';
    }
    else
    {
        document.body.style.background = 'rgb(200, 200, 200)'
        document.body.style.color = 'black'
    }
    darkmode_onoff = prefersDarkMode ? "dark":"light"
}


let postmode;
let url = ``;
onMount(() => {
    
});



</script>
<svelte:head>
    {#key postmode}
    <title>{postmode!='Document'?'Lutica\'s bar':false}</title>
    {/key}
</svelte:head>

{#key darkmode_onoff}
<div id="header_div">

</div>
<main>
    <div id="blog">
        <p1>HI !</p1>
    </div>
    <!--간단한 형식으로 리모델링.-->
</main>
<footer>
    <div>
        <p1>
            Lutica's blog
        </p1>
    </div>
</footer>
{/key}
