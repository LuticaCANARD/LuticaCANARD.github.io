<script>
  import LangChoice from "../langChoice.svelte"
  import SetDarkmodeButton from "../setDarkmodeButton.svelte"
  import { MOBILE_HEADER_WIDTH } from "../../../constants";
  let innerW;
  let style;
  $: innerW > MOBILE_HEADER_WIDTH ? 
    style = `flex-direction: row` :
    style = `flex-direction: column`
</script>
<style lang="scss">
.header-util{
    display: flex;
    justify-content: center;
    padding: 0.5rem;
}
</style>
<svelte:window bind:innerWidth={innerW}/>
<div class="header-util" style={style}>
    <LangChoice/>
    <SetDarkmodeButton/>
</div>