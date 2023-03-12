<script>
    import "prism-themes/themes/prism-dracula.css";
    import LittleCategory from './DictPosts.svelte'

    let open = null;
    export let big_car;
    export let name;


</script>

<div>
<!--이하 카테고리 산하-->
{name}
<div class="big_category">
    <LittleCategory little_post_car={big_car}/>
</div>

</div>