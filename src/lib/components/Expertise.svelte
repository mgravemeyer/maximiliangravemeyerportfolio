<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '$lib/utils/animations';
	import { setCursorVariant, resetCursor } from '$lib/stores/cursor';

	let sectionEl = $state<HTMLElement | null>(null);

	interface Skill {
		title: string;
		description: string;
	}

	const skills: Skill[] = [
		{
			title: 'Product & Strategy',
			description: 'I shape digital products from idea to launch — scoping features, planning roadmaps, and making the hard trade-offs that keep things moving.'
		},
		{
			title: 'Team & Resource Management',
			description: 'I manage teams, allocate resources, and run projects across timezones — keeping people aligned and delivery on track.'
		},
		{
			title: 'Design & Development',
			description: 'I design interfaces and build them myself. React, Next.js, Svelte, Node — from prototype to production.'
		},
		{
			title: 'AI-Native Workflows',
			description: 'AI is part of how I work, not a buzzword. I build AI into research, design, code, and ops — and help teams do the same.'
		}
	];

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		if (!sectionEl) return;

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: sectionEl,
				start: 'top 75%',
				toggleActions: 'play none none none'
			}
		});

		const cards = sectionEl.querySelectorAll('.skill-card');
		tl.fromTo(
			cards,
			{ opacity: 0, y: 20 },
			{
				opacity: 1,
				y: 0,
				duration: 0.6,
				stagger: 0.1,
				ease: 'power3.out'
			}
		);
	});
</script>

<section
	bind:this={sectionEl}
	id="expertise"
	class="relative px-6 py-24 md:py-32"
>
	<div class="mx-auto max-w-7xl">
		<!-- Section header -->
		<div
			class="border-b pb-4"
			style:border-color="var(--color-border)"
		>
			<h2
				class="text-xs font-medium uppercase tracking-widest"
				style:color="var(--color-text-tertiary)"
			>
				Expertise
			</h2>
		</div>

		<!-- Content grid -->
		<div class="mt-10 grid grid-cols-1 gap-12 md:grid-cols-12">
			<!-- Left: statement -->
			<div class="md:col-span-4">
				<p
					class="text-2xl leading-snug font-light tracking-tight sm:text-3xl"
					style:color="var(--color-text)"
					onmouseenter={() => setCursorVariant('text')}
					onmouseleave={() => resetCursor()}
				>
					I lead teams, design products, and write code —
					<span
						class="inline-block rounded px-1"
						style:background-color="var(--color-bg-alt)"
					>whatever it takes to ship.</span>
				</p>
			</div>

			<!-- Right: skill cards 2x2 -->
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-8">
				{#each skills as skill (skill.title)}
					<div
						class="skill-card flex flex-col items-center rounded-lg border border-dashed px-6 py-8 text-center opacity-0 transition-colors duration-300"
						style:border-color="var(--color-border)"
						onmouseenter={() => setCursorVariant('hover')}
						onmouseleave={() => resetCursor()}
						role="article"
					>
						<h3
							class="text-sm font-semibold"
							style:color="var(--color-text)"
						>
							{skill.title}
						</h3>
						<p
							class="mt-3 text-xs leading-relaxed"
							style:color="var(--color-text-secondary)"
						>
							{skill.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
