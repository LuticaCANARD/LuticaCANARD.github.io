<script>
    export let post
    export let posts_po
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    let piclink = '../assets/' + post.pic_code + '.png'
    let height_ = 0;
    let post_obj;
    let inner_height = 0;
    let scy = 0;
    let now_scy = 0;
    let now_scy_show = 0;
    let postcard_obj;
    //function show_ani(node,{top,left},)
    {

    }
    //const showing_animation;
    onMount(()=>
    {
        now_scy_show = post_obj?.offsetTop;
        now_scy = scy + inner_height
        console.log(posts_po)
        if ( now_scy < now_scy_show )
        {
            postcard_obj.style.display="none"
            // 여기에 애니메이션을 시작하면 된다.
            //console.log(postcard_obj)
            console.log('m')
        }
    })
    
    document.addEventListener('scroll',(event)=>
    {
        now_scy_show = post_obj?.offsetTop;
        now_scy = scy + inner_height
        if ( now_scy > now_scy_show )
        {
            postcard_obj.style.display="flex"
            // 여기에 애니메이션을 시작하면 된다.
            //console.log(postcard_obj)
            console.log('m')
        }
    }) 
</script>
<svelte:window bind:scrollY={scy} bind:innerHeight={inner_height}/>
<div class="card" bind:this={post_obj}>
    <div class="card__first_warpper" bind:this={postcard_obj} transition:fade>
        <!--Animation 적용시 유의점 : 시간차를 조금 둬서 user가 인지할 수 있게 할 것.-->
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