<script>

import Store from '../store.js'
var store = new Store()
export let postarray
export var documentcontoroll
import Card from './profile_card.svelte'
</script>
<div id="posts">
    {#each postarray as post} 
    <Card post={post}></Card>
    {/each}

</div>
