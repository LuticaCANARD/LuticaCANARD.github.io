
<script>

import Profile from './lib/routers/profile.svelte';

import rout from './lib/routers/index.js'
import Header from './lib/header.svelte'
import Store from './store.js'
import { onMount } from 'svelte';
import Router from 'svelte-spa-router';
  //path와 라우팅 할 컴포넌트

let postmode;
let array = [{name:'profile',link:'Profile'},{name:'posts',link:'Posts'},{name:'webasm',link:'webasm'}]
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
    console.log(argus)
    if( argus.length > 1)
    {
        postmode = argus[1]
    }
});


</script>


{#if birthdate==true}
<div>
    <Profile></Profile>
    <div style="text-align:center"><h1> today is my birthday!</h1></div>
</div>
<p1>check : </p1><input type='checkbox' bind:value={birthdate}>
{:else}
<div id="header_div">
    <Header bind:MainbarArray={array} changename = {changename} bind:mobiletag={mobiletag}></Header>
</div>
<main>

    <br><br>
    <div id="blog">
        <Router routes={rout} />
    </div>
    <!--간단한 형식으로 리모델링.-->
</main>
{/if}
