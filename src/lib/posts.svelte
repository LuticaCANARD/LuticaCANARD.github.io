<script>

import Store from '../store.js'
var store = new Store()
export let postarray
export var documentcontoroll
import Card from './profile_card.svelte'
let scy = 0;
let inner_height = 0;
let card;
let posts_postion = 0;
let posts_object;
</script>
<svelte:window bind:scrollY={scy} bind:innerHeight={inner_height}/>
{scy}
{posts_object?.offsetTop}
<div id="posts" bind:clientHeight={posts_postion} bind:this={posts_object}>
    {#each postarray as post} 
    <Card post={post} posts_po={posts_object?.offsetTop}></Card>
    {/each}
</div>

<!-- innerHeight를 조사해서 위치가 그 안이면 처음에 렌더링, 그 이후면 scroll Y를 조사하여 그값에 다다르면 업데이트 한다.-->
