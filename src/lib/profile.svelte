<script>
    import profilepic from '../assets/profile.png'
    const history = [
        {
            name : "Lathion_project",
            stacks : [
                {
                    name: "Python",
                    imglink:"",
                    desc: " SERVER "
                },                
                {
                    name: "C# / Unity",
                    imglink:"",
                    desc: " Unity Client "
                },
                {
                    name: "JS",
                    imglink:"",
                    desc: " Web Client "
                },
            ],
            desc : "# projects to ..."
        }
    ]
    import SvelteMarkdown from 'svelte-markdown'
 
</script>
<div id="profile">
    <center>
        <div>
            <!-- 프로필 사진 -->
            
            <!-- 약력 -->
            <div id="profile_history">
                {#each history as story}
                    <div class="history_element">
                        <!--이름, 스택, 서술-->
                        <div class="history_element_name">
                            {story.name}
                        </div>
                        <div class="history_element_stack">
                            {#each story.stacks as stack}
                                <div class="stacks">
                                    <div class="stacks_img">
                                        <img src={stack.imglink}/>
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
                            <SvelteMarkdown source={story.desc}></SvelteMarkdown>
                        </div>
                    </div>
                {/each}
            </div>
            <!-- 진행중인 프로젝트 -->
            <!-- GITHUB Link 등 -->
        </div>
    </center>
    <div style="text-align : right; ">
        <p1>
            Twitter : <a href="https://twitter.com/presan100">@presan100</a><br>
            Twitter (VRC) : <a href = "https://twitter.com/presan100_JP">@presan100_jp</a><br>
        </p1>
    </div>
    <div style="text-align:center">
        <p1>
            Hello! I'm Lutica on VRC , Twitter, Github, ... etc!
        </p1>
    </div>
    <br><br>
</div>