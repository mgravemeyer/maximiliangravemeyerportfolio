<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '$lib/utils/animations';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
	let wrapperEl = $state<HTMLDivElement | null>(null);

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		if (!wrapperEl) return;

		// White overlay reveal effect
		const overlay = wrapperEl.querySelector('.scroll-reveal-overlay');
		if (overlay) {
			gsap.fromTo(
				overlay,
				{ scaleY: 1 },
				{
					scaleY: 0,
					duration: 1,
					ease: 'power3.inOut',
					scrollTrigger: {
						trigger: wrapperEl,
						start: 'top 80%',
						toggleActions: 'play none none none'
					}
				}
			);
		}

		// Fade in content underneath
		const content = wrapperEl.querySelector('.scroll-reveal-content');
		if (content) {
			gsap.fromTo(
				content,
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					delay: 0.3,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: wrapperEl,
						start: 'top 80%',
						toggleActions: 'play none none none'
					}
				}
			);
		}
	});
</script>

<div bind:this={wrapperEl} class="relative overflow-hidden">
	<div class="scroll-reveal-content opacity-0">
		{@render children()}
	</div>
	<div
		class="scroll-reveal-overlay absolute inset-0 origin-bottom"
		style:background-color="var(--color-bg)"
		style:z-index="2"
	></div>
</div>
