<script>
    export let post
    let piclink = '../assets/' + post.pic_code + '.png'
</script>

<div class="card">
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