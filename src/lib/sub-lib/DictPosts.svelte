<script>
    import Card from '../sub-lib/profile_card.svelte'
    export let dist;
    export let dest;
    import "prism-themes/themes/prism-dracula.css";

</script>

<div>
{#each Object.keys(dist) as post_little}
<div>
    {#each Object.keys(dist[post_little]) as post}
    <Card post={dist[post_little][post]} linking={''}></Card>
    {/each}
</div>
{/each}
</div>