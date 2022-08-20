<script>
let name = '';
export let postarray
export var documentcontrol
</script>
<div id="posts">
    {#each postarray as post}
    <il class="post" on:click={documentcontrol(post)}>
        <h3>{post.name}</h3>
        <p1>{post.subname}</p1>
    </il>
    {/each}
</div>
