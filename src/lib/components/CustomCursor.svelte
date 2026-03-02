<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { cursorState } from '$lib/stores/cursor';
	import type { CursorState } from '$lib/types';

	let cursorEl = $state<HTMLDivElement | null>(null);
	let visible = $state(false);
	let isTouchDevice = $state(true);
	let cursorData: CursorState = $state({
		x: 0,
		y: 0,
		variant: 'default',
		label: ''
	});

	let mouseX = 0;
	let mouseY = 0;
	let cursorX = 0;
	let cursorY = 0;
	let rafId: number | undefined;
	let unsubscribe: (() => void) | undefined;

	function onMouseMove(e: MouseEvent): void {
		mouseX = e.clientX;
		mouseY = e.clientY;
		cursorState.update((s) => ({ ...s, x: e.clientX, y: e.clientY }));
		if (!visible) visible = true;
	}

	function onMouseLeave(): void {
		visible = false;
	}

	function onMouseEnter(): void {
		visible = true;
	}

	function animate(): void {
		// Near-instant tracking for responsiveness
		cursorX += (mouseX - cursorX) * 0.6;
		cursorY += (mouseY - cursorY) * 0.6;

		if (cursorEl) {
			cursorEl.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
		}

		rafId = requestAnimationFrame(animate);
	}

	onMount(() => {
		isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

		if (isTouchDevice) return;

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseleave', onMouseLeave);
		document.addEventListener('mouseenter', onMouseEnter);

		unsubscribe = cursorState.subscribe((s) => {
			cursorData = s;
		});

		rafId = requestAnimationFrame(animate);
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseleave', onMouseLeave);
			document.removeEventListener('mouseenter', onMouseEnter);
		}
		if (rafId !== undefined) cancelAnimationFrame(rafId);
		unsubscribe?.();
	});
</script>

{#if !isTouchDevice}
	<div
		bind:this={cursorEl}
		class="pointer-events-none fixed top-0 left-0 z-[9999]"
		style:opacity={visible ? 1 : 0}
		style:will-change="transform"
		style:mix-blend-mode="difference"
		aria-hidden="true"
	>
		<svg
			width="16"
			height="20"
			viewBox="0 0 16 20"
			fill="none"
			style:transform={cursorData.variant === 'hover' ? 'scale(1.15)' : 'scale(1)'}
		>
			<path
				d="M0.5 0.5L15 10L8 11L5 19.5L0.5 0.5Z"
				fill="#ffffff"
				stroke="#ffffff"
				stroke-width="0.5"
			/>
		</svg>

		<!-- "You" label -->
		<div
			class="absolute top-5 left-3.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
			style="background-color: #ffffff; color: #000000; border-color: #ffffff;"
		>
			You
		</div>
	</div>
{/if}
