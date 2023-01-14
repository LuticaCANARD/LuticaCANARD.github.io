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
<!-- innerHeight를 조사해서 위치가 그 안이면 처음에 렌더링, 그 이후면 scroll Y를 조사하여 그값에 다다르면 업데이트 한다.-->
