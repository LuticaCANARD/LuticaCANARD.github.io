<script>

    export let Link ;
    export let SL_headlink;
    export let piclink;
    headhtml = SL_headlink;
    linkhtml = Link;

</script>
<header class="masthead" style="background-image: url('{piclink}')">
    <div class="container position-relative px-4 px-lg-5">
        <div class="row gx-4 gx-lg-5 justify-content-center">
            <div class="col-md-10 col-lg-8 col-xl-7">
                <div class="post-heading">
                {@html headhtml}
                </div>
            </div>
        </div>
    </div>
</header>
<!-- Post Content-->
<article class="mb-4">
    <div class="container px-4 px-lg-5">
        <div class="row gx-4 gx-lg-5 justify-content-center">
            <div class="col-md-10 col-lg-8 col-xl-7">
                {@html linkhtml}
            </div>
        </div>
    </div>
</article>