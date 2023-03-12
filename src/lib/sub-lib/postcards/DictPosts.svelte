<script>
    import Context from './postcontest.svelte'
    export let little_post_car;
    import "prism-themes/themes/prism-dracula.css";
    let open = null;

</script>

<div>
{#each Object.keys(little_post_car) as post_little}
<!--이하 카테고리 산하-->
<Context post_little={little_post_car[post_little]} name={post_little}/>
{/each}
</div>