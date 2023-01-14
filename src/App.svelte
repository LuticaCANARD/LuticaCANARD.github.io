<script>


import Webasm from './lib/webasm.svelte'
import Posts from './lib/posts.svelte';
import Profile from './lib/profile.svelte';
import postnames from './assets/posts.json';
import Document from './lib/document.svelte';
import Header from './lib/header.svelte'
import Store from './store.js'

let postmode;
let array = [{name:'profile',link:'profile'},{name:'posts',link:'posts'},{name:'webasm',link:'webasm'}]
let mobiletag = false;
var postin={};
let date = new Date();
$: birthdate = date.getMonth()==7 && date.getDate() == 21

const changename = (name) => () => {postmode = name;}
</script>
{#if birthdate==true }
<div>
    <Profile></Profile>
    <div style="text-align:center"><h1> today is my birthday!</h1></div>
</div>
<p1>check : </p1><input type='checkbox' bind:value={birthdate}>
{:else}
<div id="header_div">
    <Header bind:array={array} changename = {changename} bind:mobiletag={mobiletag}></Header>
</div>
<main>
    <br><br>
    {#if postmode!=undefined}
    <h1 style="margin:30px 50px">{postmode}</h1>
    {:else}
    <div style="text-align:center">
        <h1>Lutica's blog</h1>
    </div>
    {/if}
    <div id="blog">
    {#if postmode=='profile'}
        <Profile></Profile>
        <Posts postarray={postnames} bind:selectedpost={postin} documentcontoroll={changename('document')}></Posts>
    {:else if postmode=='document'}
        <Document post={postin}></Document>
        <Posts postarray={postnames} bind:selectedpost={postin} documentcontoroll={changename('document')}></Posts>
    {:else if postmode=='webasm'}
        <Webasm></Webasm>
        <Posts postarray={postnames} bind:selectedpost={postin} documentcontoroll={changename('document')}></Posts>
    {:else if postmode=='posts'}
         <Posts postarray={postnames} bind:selectedpost={postin} documentcontoroll={changename('document')}></Posts>
    {:else}
        <Profile></Profile>
    {/if}
</div>
    <!--간단한 형식으로 리모델링.-->

</main>
{/if}
