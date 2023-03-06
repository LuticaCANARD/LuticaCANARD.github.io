<script>
    import profilepic from '../assets/profile.png'
    const history = [
        {
            name : "Lathion_project",
            stacks : [
                {
                    name: "Python",
                    imglink:"Python/black",
                    desc: " SERVER ",
                    need_invert : true
                },                
                {
                    name: "C# / Unity",
                    imglink:"Unity/black",
                    desc: " Unity Client ",
                    need_invert : true
                },
                {
                    name: "JS",
                    imglink:"JavaScript",
                    desc: " Web Client "
                },
            ],
            desc : "# projects to ..."
        }
    ]
    import Project_card from '../lib/project_card.svelte'
 
</script>
<div id="profile">
    <center>
        <div>
            <!-- 프로필 사진 -->
            
            <!-- 약력 -->
            <div id="profile_history">
                {#each history as story}
                   <Project_card story={story}>
                   </Project_card>
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