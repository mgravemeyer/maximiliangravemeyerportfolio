<script lang="ts">
	const COLUMNS = 6;
	const columnIndices = Array.from({ length: COLUMNS }, (_, i) => i);
</script>

<div class="pointer-events-none fixed inset-0 z-[1] mx-auto max-w-7xl px-6" aria-hidden="true">
	<div class="grid h-full gap-6" style:grid-template-columns="repeat({COLUMNS}, 1fr)">
		{#each columnIndices as index (index)}
			<div
				class="h-full"
				style:border-left="1px solid rgba(0, 0, 0, 0.03)"
				style:border-right={index === COLUMNS - 1 ? '1px solid rgba(0, 0, 0, 0.03)' : 'none'}
			></div>
		{/each}
	</div>
</div>
