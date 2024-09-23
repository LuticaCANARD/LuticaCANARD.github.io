<script>
  import LangChoice from "../langChoice.svelte"
  import SetDarkmodeButton from "../setDarkmodeButton.svelte"



</script>
<style lang="scss">
.header-util{
    display: flex;
    justify-content: flex-end;
    padding: 0.5rem;
}
</style>
<div class="header-util">
    <LangChoice/>
    <SetDarkmodeButton/>
</div>