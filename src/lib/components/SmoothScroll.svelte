<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Lenis from 'lenis';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
	let lenis: Lenis | undefined;

	onMount(() => {
		lenis = new Lenis({
			duration: 1.2,
			easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true
		});

		function raf(time: number): void {
			lenis?.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);
	});

	onDestroy(() => {
		lenis?.destroy();
	});
</script>

{@render children()}
