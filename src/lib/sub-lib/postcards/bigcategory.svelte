<script>
    import "prism-themes/themes/prism-dracula.css";
    import LittleCategory from './DictPosts.svelte'

    let open = null;
    export let big_car;
    export let name;


</script>

<div class={open==null ? "big_post_category post_category_init":(open?"big_post_category post_category_open":"big_post_category post_category_closed")}>
<!--이하 카테고리 산하-->
    <div class="category_title">
        <div class="category_title_name">
            <h1>{name}</h1>
        </div>
        <div class={open?"cartegory_btn large_car_btn_on":"cartegory_btn large_car_btn_off"} on:click={()=>{}}>
        BTN
        </div>
    </div>
    <div class="">
        <LittleCategory little_post_car={big_car}/>
    </div>

</div>