<script>

    export let history;

</script>

<div class="history_card">
    <div class="history_title">
        <h1>{history.title}</h1>
    </div>
    <div class="history_time">
        {history.time}
    </div>
    <div class="history_desc">
        {history.desc}
    </div>
    <div class="history_desc2">
        {#each history.desc2 as desci}
        <div class="history_desci">
            <p1>{desci}</p1>
        </div>
        {/each}
    </div>
</div>