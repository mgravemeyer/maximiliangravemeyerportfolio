<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Work from '$lib/components/Work.svelte';
	import Expertise from '$lib/components/Expertise.svelte';
	import Contact from '$lib/components/Contact.svelte';
</script>

<Hero />

<!-- Content slides over the sticky hero -->
<div class="relative z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.03)]" style:background-color="var(--color-bg)">
	<About />
	<Work />
	<Expertise />
	<Contact />
</div>
