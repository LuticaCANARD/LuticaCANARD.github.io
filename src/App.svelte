<script>
import Document from './lib/document.svelte';
import Posts from './lib/posts.svelte';
import Profile from './lib/profile.svelte';
let postmode;
let array = [{name:'profile',link:'profile'},{name:'posts',link:'posts'},{name:'document',link:'document'}]
const changename = name=> () =>postmode = name
</script>
<div class="navbar">
    <div class="container" >
    {#each array as datak}
        <il class="navitem">
           <div on:click={changename(datak.link)} style ='text-decoration:none;color: black; width:100%;height:30px; padding-top:10px'> <p1>
                {datak.name}
            </p1></div>
        </il>
    {/each}
    </div>
</div>
<main>
    <br><br>

    {#if postmode!=undefined}
    <h1>{postmode}</h1>
    {:else}
    <div style="text-align:center">
        <h1>Lutica's blog</h1>
    </div>
    {/if}
    <div id="blog">
    {#if postmode=='profile'}
        <Profile></Profile>
        <Posts></Posts>
    {:else if postmode=='document'}
        <Document></Document>
        <Posts></Posts>
    {:else if postmode=='posts'}
        <Posts></Posts>
    {:else}
        <Profile></Profile>
    {/if}
</div>
    

</main>
