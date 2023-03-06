<script>
    import profilepic from '../assets/profile.png'
    import projects from '../assets/project.json'
    const project = projects["body"]
    import historys from '../assets/history.json'
    const history = historys["body"]
    import stackss from '../assets/stacks.json'
    const stacks = stackss
    const sva = Object.keys(stackss)
    import Project_card from '../lib/sub-lib/project_card.svelte'
    import History_card from '../lib/sub-lib/history_card.svelte'
    import Stacks from '../lib/sub-lib/stacks.svelte'
</script>
<div id="profile">
    <center>
        <div>
            <!-- 프로필 사진 -->
            <div id="profile_pic">
                <img src={profilepic}>
            </div>
            <!-- NAME 등 -->
            <div>
                <h1>Lutica CANARD</h1>
            </div>
            <!-- 스택 -->
            <div id="stack_groups">
                {#each sva as stack_group}
                    <div class="stack_domain_warp">
                        <div class="stack_domain">
                            <h2>
                                {stack_group}
                            </h2>
                        </div>
                        <div class="stack_group">
                            {#each stacks[stack_group] as stack_gp}
                            <Stacks stack={stack_gp}></Stacks>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
            <!-- 약력 -->
            <div id="history_list">
                {#each history as strs}
                <History_card history={strs}>
                </History_card>
                {/each}
            </div>
            <!-- 진행중인 프로젝트 -->
            <div id="profile_history">
                {#each project as story}
                   <Project_card story={story}>
                   </Project_card>
                {/each}
            </div>
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