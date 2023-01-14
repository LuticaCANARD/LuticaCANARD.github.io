<script>
    export let title
    export let desc
    export let pic_code = null
    let piclink = '../assets/' + pic_code + '.png'
</script>

<div class="card">
    <div class="card__first_warpper">
        {#if pic_code!=null }
        <div class="card__pic">
            <img src="{piclink}" class="card_pic">
        </div>
        {/if}
        <div class="card__second_warpper">
            <div class="card__title">
                {title}
            </div>
            <div class="card__desc">
                {desc}
            </div>
        </div>
    </div>
</div>