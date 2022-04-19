<script>
import {posts} from "../assets/posts.json"
</script>
    <!-- Page Header-->
    <header class="masthead" style="background-image: url('assets/img/home-bg.jpg')">
    <div class="container position-relative px-4 px-lg-5">
        <div class="row gx-4 gx-lg-5 justify-content-center">
            <div class="col-md-10 col-lg-8 col-xl-7">
                <div class="site-heading">
                    <h1>Lutica's blog</h1>
                    <span class="subheading">A journey to find brilliant story. </span>
                </div>
            </div>
        </div>
    </div>
</header>
{#each posters as {Link,piclink,title,subtitle,date,headlink},i}}
<script>
function Click()
{
    GL_Link = {Link};
    GL_piclink = {GL_piclink};
    GL_headlink = {headlink};
    
}
</script>
 <!-- Main Content-->
 <div class="container px-4 px-lg-5">
    <div class="row gx-4 gx-lg-5 justify-content-center">
        <div class="col-md-10 col-lg-8 col-xl-7">
            <!-- Post preview-->
            <div class="post-preview">
                <a href="#" on:click={Click}>
                    <h2 class="post-title">{title}</h2>
                    <h3 class="post-subtitle">{subtitle}</h3>
                </a>
                <p class="post-meta">
                    Posted by
                    <a href="#!">Lutica</a>
                    on {date}
                </p>
            </div>
            <!-- Divider-->
            <hr class="my-4" />
            {/each}
            <!-- Pager-->
            <div class="d-flex justify-content-end mb-4"><a class="btn btn-primary text-uppercase" href="#!">Older Posts →</a></div>
        </div>
    </div>
</div>