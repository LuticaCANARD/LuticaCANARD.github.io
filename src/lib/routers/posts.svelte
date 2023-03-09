<script>

import Store from '../../store.js'
var store = new Store()
import postarray from '../../assets/posts.json'
import DictPosts from '../sub-lib/DictPosts.svelte'
let scy = 0;
let inner_height = 0;
let card;
let posts_postion = 0;
var posts_object;
/*/ 여기서 제어.
// postarray : {
// "대 분류" :[
//      "소분류"
//]
//}*/
//let postarray = import.meta.glob('/Posts')
</script>
<svelte:window bind:scrollY={scy} bind:innerHeight={inner_height}/>
<div id="posts" bind:clientHeight={posts_postion} bind:this={posts_object}>
    {#each Object.keys(postarray) as _dist} 
    <DictPosts dist={postarray[_dist]} dest={_dist}/>
    {/each}
</div>

<!-- innerHeight를 조사해서 위치가 그 안이면 처음에 렌더링, 그 이후면 scroll Y를 조사하여 그값에 다다르면 업데이트 한다.-->
