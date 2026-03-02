<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let cursorX = $state(0);
	let cursorY = $state(0);
	let visible = $state(false);
	let isTouchDevice = $state(true);
	let rafId: number | undefined;

	// Target positions for smooth movement
	let targetX = 0;
	let targetY = 0;

	const name = 'Max';

	function getRandomTarget(): void {
		const padding = 150;
		targetX = padding + Math.random() * (window.innerWidth - padding * 2);
		targetY = padding + Math.random() * (window.innerHeight - padding * 2);
	}

	function animate(): void {
		// Slow smooth follow to target
		cursorX += (targetX - cursorX) * 0.008;
		cursorY += (targetY - cursorY) * 0.008;

		rafId = requestAnimationFrame(animate);
	}

	let moveInterval: ReturnType<typeof setInterval> | undefined;

	onMount(() => {
		isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		if (isTouchDevice) return;

		// Show after a delay
		const showTimeout = setTimeout(() => {
			visible = true;
			cursorX = window.innerWidth * 0.6;
			cursorY = window.innerHeight * 0.4;
			getRandomTarget();
			rafId = requestAnimationFrame(animate);

			// Change target every few seconds
			moveInterval = setInterval(getRandomTarget, 4000);
		}, 2500);

		return () => clearTimeout(showTimeout);
	});

	onDestroy(() => {
		if (rafId !== undefined) cancelAnimationFrame(rafId);
		if (moveInterval) clearInterval(moveInterval);
	});
</script>

{#if !isTouchDevice && visible}
	<div
		class="pointer-events-none fixed"
		style:left="{cursorX}px"
		style:top="{cursorY}px"
		style:z-index="9998"
		aria-hidden="true"
	>
		<svg width="16" height="20" viewBox="0 0 16 20" fill="none" class="drop-shadow-sm">
			<path
				d="M0.5 0.5L15 10L8 11L5 19.5L0.5 0.5Z"
				fill="#8b5cf6"
				stroke="#7c3aed"
				stroke-width="0.5"
			/>
		</svg>
		<div
			class="absolute top-4 left-4 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium shadow-sm"
			style:background-color="#8b5cf6"
			style:color="white"
		>
			{name}
		</div>
	</div>
{/if}
