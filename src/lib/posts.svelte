<script>
$: arraya = ['as','fd','ll','jj','jj','jjfd','gfjd','fdsfsd','asdasd'];
let name = '';
function addpost()
{
    arraya = [...arraya,name]
}
</script>
<div id="posts">
    {#each arraya as post}
    <il class="post">
        <h3>{post}</h3>
    </il>
    {/each}
    <div id = "inputing">
        <input id="postadd" bind:value={name}><button on:click={addpost}>추가</button>
    </div>
</div>
