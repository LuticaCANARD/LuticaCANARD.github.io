<script>
    export let story;
    import SvelteMarkdown from 'svelte-markdown'
    import {onMount} from 'svelte'
    const req = new XMLHttpRequest();
    let tn;
    onMount(()=>{
        req.open('GET','/projects/'+story.desc+'.md',true)
        req.onload=function(){
            tn=req.responseText
        }
        req.send();
    })
</script>

<div class="history_element">
    <!--이름, 스택, 서술-->
    <div class="proj_war">
        <div class="history_element_name">
            <div class="history_element_name_text">
                <h4>{story.name}</h4>
            </div>
        </div>
        <div class="project_desc_">
            <div class="history_element_stack">
                {#each story.stacks as stack}
                    <div class="stacks">
                        <div class="stacks_img">
                            <img src={"https://cdn.simpleicons.org/"+stack.imglink} class={stack.need_invert?"need_invert":""}/>
                        </div>
                        <div class="stacks_name">
                            <h3>{stack.name}</h3>
                        </div>
                        <div class="stacks_desc">
                            <p1>{stack.desc}</p1>
                        </div>
                    </div>
                {/each}
            </div>
            <div class="history_element_desc">
                <SvelteMarkdown source={tn}></SvelteMarkdown>
            </div>
        </div>
    </div>
</div>
