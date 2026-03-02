<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let scrolled = $state(false);
	let currentTime = $state('');

	function handleScroll(): void {
		scrolled = window.scrollY > 50;
	}

	function updateTime(): void {
		const now = new Date();
		const options: Intl.DateTimeFormatOptions = {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
			timeZone: 'Europe/Berlin'
		};
		const time = now.toLocaleTimeString('en-US', options);
		const dateOptions: Intl.DateTimeFormatOptions = {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			timeZone: 'Europe/Berlin'
		};
		const date = now.toLocaleDateString('en-US', dateOptions);
		currentTime = `Berlin ${time} \u00B7 ${date}`;
	}

	let timeInterval: ReturnType<typeof setInterval> | undefined;

	onMount(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		updateTime();
		timeInterval = setInterval(updateTime, 60000);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', handleScroll);
		}
		if (timeInterval) clearInterval(timeInterval);
	});
</script>

<nav
	class="fixed top-0 right-0 left-0 z-50 transition-all duration-500 {scrolled
		? 'border-b backdrop-blur-md'
		: ''}"
	style:background-color={scrolled ? 'rgba(250, 250, 250, 0.85)' : 'transparent'}
	style:border-color={scrolled ? 'var(--color-border-light)' : 'transparent'}
>
	<div class="mx-auto flex max-w-7xl items-center px-6 py-4">
		<!-- Location & time -->
		<div
			class="text-xs leading-tight"
			style:color="var(--color-text-tertiary)"
		>
			{currentTime}
		</div>
	</div>
</nav>
