<script>
    const profilepic = '/profile.png'
    import projects from '../../assets/project.json'
    const project = projects["body"]
    import historys from '../../assets/history.json'
    const history = historys["body"]
    import stackss from '../../assets/stacks.json'
    const stacks = stackss
    const sva = Object.keys(stackss)
    import Project_card from '../../lib/sub-lib/project_card.svelte'
    import History_card from '../../lib/sub-lib/history_card.svelte'
    import Stacks from '../../lib/sub-lib/stacks.svelte'
    import Contactso from '../../assets/contacts.json'
    const contacts = Contactso["body"]
    import Contactcard from '../../lib/sub-lib/contact.svelte'


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
                <hr>
                <h1> STACKS </h1>
                <hr>
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
            <div>
                <hr>
                <h1> HISTORY </h1>
                <hr>
            </div>
            <!-- 약력 -->
            <div id="history_list">
                {#each history as strs}
                <History_card history={strs}>
                </History_card>
                {/each}
            </div>
            <div>
                <hr>
                <h1> PROJECTS </h1>
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
        <!--컨택-->
        <hr>
        <h1>CONTACT</h1>
        <div id="contact">
            {#each contacts as contact}
            <Contactcard tact={contact}>
            </Contactcard>
            {/each}
        </div>

    </center>
</div>