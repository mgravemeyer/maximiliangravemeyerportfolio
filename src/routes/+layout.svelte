<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import GridGuides from '$lib/components/GridGuides.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import SmoothScroll from '$lib/components/SmoothScroll.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Maximilian Gravemeyer — Product Leader, Founder, Developer</title>
	<meta
		name="description"
		content="Helping companies design, build, and launch new digital products. Product Leader, Founder of Rosenthaler, Full Stack Developer based in Berlin."
	/>
</svelte:head>

<CustomCursor />
<GridGuides />
<Navigation />

<SmoothScroll>
	<main>
		{@render children()}
	</main>
</SmoothScroll>
