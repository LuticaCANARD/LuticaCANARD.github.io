<script>
import Document from './lib/document.svelte';
import Posts from './lib/posts.svelte';
import Profile from './lib/profile.svelte';
let postmode;
let array = [{name:'profile',link:'profile'},{name:'posts',link:'posts'},{name:'document',link:'document'}]
let mobiletag = false;
const changename = name=> () =>postmode = name
</script>
<div class="navbar">
    <div style="width: 20%;text-align: center;padding-top: 0px;" ><h3 style="margin:0%">Lutica's bar</h3></div>
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
<div class="mobile_navbar">
    {#if mobiletag==true}
    <div on:click={()=>mobiletag=false} style="width: 20%;text-align: center;padding-top: 10px;">OFF</div>
    <div class="container_m">
    {#each array as datak}
        <il class="navitem_m">
            <div on:click={changename(datak.link)} style ='text-decoration:none;color: black; width:100%;height:30px; padding-top:10px'> <p1>
                {datak.name}
            </p1></div>
        </il>
    {/each}
    </div>
    {:else}
    <div on:click={()=>mobiletag=true} style="width: 20%;text-align: center;padding-top: 10px;">ON</div>
    {/if}
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
