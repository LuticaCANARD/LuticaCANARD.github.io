<script>
    // You can add any script logic here if needed
    export const setting ={
        relative : false
    }
    
</script>

<style>
    .loader {
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
        margin: auto;
        position: absolute;
        top: 0; bottom: 0; left: 0; right: 0;
    }
    .loading-wrapper{
        position: relative;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
{#if setting.relative}
    <div class="loading-wrapper">
        <div class="loader"></div>
    </div>
{:else}
    <div class="loader"></div>
{/if}