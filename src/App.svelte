
<script>            
                let menu_listsk1 = [
                    {id : 1 , label : "Home",href : "#",onclick : {}},
                    {id : 2 , label : "Blog",href : "#",onclick : {}},
                    {id : 3 , label : "Posts",href : "#",onclick : {}},
                    {id : 4, label : "Contact" , href : "#",onclick : {}},
                    {id : 5, label : "Profile" , href:"#",onclick : {}},
                    {id : 6, label : "Other Site",href : "#",onclick : {}} ];
                    let context2 = "<h1> Welcome to Lutica's Field! <br> <br> <p1 class = 'p-2'>Here is Test Field about Svelte web blogs! ";
						//context 불러오기 구현
					let link;   
                    let dropdown = [
                        {id : 1,label : "Action",href : "#",onclick : ""},
                        {id : 2, label : "Other Action", href: "#", onclick :""}
                    ];
                    let navbar = [
                        {id:1,label :"Home",href :"#" }
                    ]
                    let is_darkmode ="bg-white"
                    let is_darkmode_light ="bg-light"
                    let font_mode = ""
                    let List_item_bgcolor ="list-group-item-light"
                    let nav_bar = "navbar-light"
                    function funis_darkmode() {
                        if(is_darkmode=="bg-white"||is_darkmode_light=="bg-light"){
                            font_mode = " text-white"
                            is_darkmode = "bg-black";
                            is_darkmode_light = "bg-dark";
                            List_item_bgcolor ="list-group-item-dark"
                            nav_bar = "navbar-dark"
                            console.log("be black");
                        }else{
                            List_item_bgcolor ="list-group-item-light"
                            is_darkmode = "bg-white";
                            is_darkmode_light = "bg-light";
                            font_mode = ""
                            List_item_bgcolor ="list-group-item-light"
                            nav_bar = "navbar-light"
                            console.log("be white")
                    }}
                    import Inner_context from "./context.svelte"
                    let content_mode;
                    let toggle_button;

</script>
<style>
</style>

    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <title>Simple Sidebar - Start Bootstrap Template</title>
        <!-- Favicon-->
        <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
        <!-- Core theme CSS (includes Bootstrap)-->
        <link href="../build/styles.css" rel="stylesheet"/>
        
    </head>
    <body class = {is_darkmode_light}>
        <div class="d-flex" id="wrapper">
            <!-- Sidebar-->
            <div class={"border-end "+is_darkmode_light} id="sidebar-wrapper" rel="../build/styles.css">
               <div class={"sidebar-heading border-bottom"+is_darkmode_light+font_mode}>Lutica's field</div>
                <div class="list-group list-group-flush">
                    {#each menu_listsk1 as menu (menu.id) }
                        <il><a class={"list-group-item list-group-item-action "+List_item_bgcolor+font_mode+" p-3"} on:click = {()=> content_mode=menu.label} href={menu.href}>{menu.label}</a></il>
                    {/each}
                </div>
            </div>
            <!-- Page content wrapper-->
            <div id="page-content-wrapper">
                <!-- Top navigation-->
                <nav class={"navbar navbar-expand-lg "+nav_bar+" "+List_item_bgcolor+" border-bottom"}>
                    <div class="container-fluid"bind:clientWidth = {toggle_button} >

                        <button class="btn btn-primary" id="sidebarToggle" on:click={funis_darkmode}>Change to Darkmode</button>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
                        <div class={"collapse navbar-collapse "+is_darkmode_light} id="navbarSupportedContent">
                            <ul class="navbar-nav ms-auto mt-2 mt-lg-0">
                                {#each menu_listsk1 as drop}
                                <li class={"nav-item active "+is_darkmode_light+font_mode}><a class="nav-link" href={drop.href} on:click = {()=>content_mode=drop.label}>{drop.label}</a></li>
                                {/each}
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">other_menu</a>
                                    <div class={"dropdown-menu dropdown-menu-end "+is_darkmode_light} aria-labelledby="navbarDropdown">
                                        {#each dropdown as drop}
                                        <a class={"dropdown-item"+font_mode} href={drop.href} >{drop.label}</a>
                                        {/each}
                                        <div class="dropdown-divider"></div>
                                        <a class={"dropdown-item"+font_mode} href="#!" on:click={funis_darkmode}>Change to Darkmode</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
				<div> 
                <!-- Page content-->
                <Inner_context
                context_mode = {content_mode}
                bg_mode = {is_darkmode_light}
                font_mode = {font_mode}
                size_all = "device-width"
                size_bar = ""/>
			</div>
        </div>
        <!-- Bootstrap core JS-->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
        <!-- Core theme JS-->
    </body>