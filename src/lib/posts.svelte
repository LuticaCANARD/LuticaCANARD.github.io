<script>

import Store from '../store.js'
var store = new Store()
export let selectedpost
export var documentcontoroll
import Card from './profile_card.svelte'
</script>
<div id="posts">
    {#each store.array_of_post as post} 
    <Card pic_code=post.pic desc =post.title title=post.title></Card>
    {/each}

</div>
