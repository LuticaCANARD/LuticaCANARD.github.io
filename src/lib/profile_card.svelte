<script>
    export let post
    export let posts_po
    import { onMount } from 'svelte';
    let piclink = '../assets/' + post.pic_code + '.png'
    let height_ = 0;
    let post_obj;
    let inner_height = 0;
    let scy = 0;
    let now_scy = 0;
    let now_scy_show = 0;
    document.addEventListener('scroll',(event)=>
    {
        now_scy_show = post_obj?.offsetTop+posts_po;
        now_scy = scy + inner_height
        if ( now_scy > now_scy_show )
        {
            // 여기에 애니메이션을 시작하면 된다.
            console.log(post.name +'/' +post_obj?.offsetTop )
            console.log('now : '+now_scy)
        }
    }) 
</script>
<svelte:window bind:scrollY={scy} bind:innerHeight={inner_height}/>
<div class="card" bind:this={post_obj}>
    <div class="card__first_warpper">
        {#if post.pic_code!= undefined}
        <div class="card__pic">
            <img src="{post.piclink}" class="card_pic">
        </div>
        {/if}
        <div class="card__second_warpper">
            <div class="card__title">
                {post.name}
            </div>
            <div class="card__desc">
                {post.subname}
            </div>
        </div>
    </div>
</div>