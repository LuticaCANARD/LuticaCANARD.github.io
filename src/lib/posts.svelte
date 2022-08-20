<script>

export let postarray
export let selectedpost
export var documentcontoroll
function selectpost (post)
{
    selectedpost = post
    documentcontoroll();
}
</script>
<div id="posts">
    {#each postarray as post}
    <il class="post" on:click={selectpost(post)}>
        <h3>{post.name}</h3>
        <p1>{post.subname}</p1>
    </il>
    {/each}
</div>
