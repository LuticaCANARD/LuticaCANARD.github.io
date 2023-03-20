
<script>

import Profile from './lib/routers/profile.svelte';

import rout from './lib/routers/index.js'
import Header from './lib/header.svelte'
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
    if (prefersDarkMode) {
        document.body.style='background: #171718';
    }
    else{
        document.body.style='background: rgb(200, 200, 200)'
    }
    darkmode_onoff = prefersDarkMode?"dark":"light"
}


let postmode;
let mobiletag = false;
var postin={};
let date = new Date();
$: birthdate = date.getMonth()==7 && date.getDate() == 21
const changename = (name) => () => {postmode = name;}
let url = ``;
onMount(() => {
    url = window.location.href
    url = url.replace('https://','')
    url = url.replace('http://','')
    let argus = url.split('/')
    //console.log(argus)
    if( argus.length > 1)
    {
        postmode = argus[1]
    }
});



</script>
<svelte:head>
    {#key postmode}
    <title>{postmode!='Document'?'Lutica\'s bar':false}</title>
    {/key}
</svelte:head>
{#key darkmode_onoff}
{#if birthdate==true}
<div>
    <Profile></Profile>
    <div style="text-align:center"><h1> today is my birthday!</h1></div>
</div>
<p1>check : </p1><input type='checkbox' bind:value={birthdate}>
{:else}

<div id="header_div" islight={darkmode_onoff}>
    <Header></Header>
</div>
<main islight={darkmode_onoff}>

    <div id="blog" >
        <Router routes={rout} />
    </div>
    <!--간단한 형식으로 리모델링.-->
</main>
{/if}
<footer islight={darkmode_onoff}>
    <div>
        <p1>
            Lutica's blog
        </p1>
    </div>
</footer>
{/key}
