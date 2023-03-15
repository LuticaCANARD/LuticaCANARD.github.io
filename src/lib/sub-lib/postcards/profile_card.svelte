<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    let postin;
    let postmode;
    export let post ;
    export let linking;
    let piclink = '../assets/' + post.pic_code + '.png'
    let height_ = 0;
    let post_obj;
    let inner_height = 0;
    let scy = 0;
    let now_scy = 0;
    let now_scy_show = 0;
    let postcard_obj;
    let show_ = true
    let ani_set =  {duration:100};
    function show_ani(node,{ duration })
    {
		return {duration,
		css: timer=> {
			return `
			transform: rotateX(${timer * 360}deg) translate(calc(100% - ${timer * 100}%),0px);
			`
		    }
        };
    }
    //const showing_animation;
    onMount(()=>
    {
        now_scy_show = post_obj?.offsetTop;
        now_scy = scy + inner_height
        if ( now_scy < now_scy_show+100 )
        {
            show_ = false
            ani_set = {duration:200}
        }
        else
        {
            ani_set = {duration:100}
        }
    })
    
    document.addEventListener('scroll',(event)=>
    {
        now_scy_show = post_obj?.offsetTop;
        now_scy = scy + inner_height
        if ( now_scy > now_scy_show-10 )
        {            
            // 여기에 애니메이션을 시작하면 된다.
            //console.log(postcard_obj)
            show_ = true
        }
    }) 
</script>
<svelte:window bind:scrollY={scy} bind:innerHeight={inner_height}/>

<div class="card" bind:this={post_obj}>
    
    {#if show_}
    <a href={"/#/Document/"+linking+post.link} class="card_a">
        <div class="card__first_warpper pointer" style="translate(100%,0px)" bind:this={postcard_obj} in:show_ani="{ani_set}" >
            <!--Animation 적용시 유의점 : 시간차를 조금 둬서 user가 인지할 수 있게 할 것.-->
            {#if post.piclink!= undefined}
            <div class="card__pic">
                <img src="{post.piclink}" class="card_pic" alt="NON">
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
    </a>
    {:else}
    <div class="card__first_warpper" style="translate(100%,0px);display:none" bind:this={postcard_obj} in:show_ani="{ani_set}">
        <!--Animation 적용시 유의점 : 시간차를 조금 둬서 user가 인지할 수 있게 할 것.-->
        {#if post.piclink!= undefined}
        <div class="card__pic">
            <img src="{post.piclink}" class="card_pic" alt="NON">
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
    {/if}
</div>