<script>
    import { onMount } from "svelte"
    import ContactItem from "../../components/contactItem.svelte";
    import contactInfos from "../../../assets/contacts.json";

    onMount(()=>{
        console.log("Contact")
    })
</script>
<div>
    <h1>
        Contact
    </h1>
    {#each contactInfos['body'] as contact }
        <ContactItem contactInfo={contact}/>
    {/each}
</div>