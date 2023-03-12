<script type="text/javascript">
    export let post_little
    export let name
    import Card from './profile_card.svelte'
    let open = null;
</script>
{name}
<div class={"post_category post_category_"+(open==null ? "init" : (open?"open":"closed"))} on:click={()=>{open = !open}}>
    <div class="post_card_off"></div>
    {#each Object.keys(post_little) as post}
        <Card post={post_little[post]} linking={''}></Card>
    {/each}
    
</div>