<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '$lib/utils/animations';
	import { setCursorVariant, resetCursor } from '$lib/stores/cursor';

	let sectionEl = $state<HTMLElement | null>(null);
	let headingEl = $state<HTMLDivElement | null>(null);
	let bioEl = $state<HTMLDivElement | null>(null);
	let statsEl = $state<HTMLDivElement | null>(null);

	const stats = [
		{ value: '8+', label: 'Years Experience' },
		{ value: '15+', label: 'Clients Served' },
		{ value: '50+', label: 'Products Shipped' }
	];

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: sectionEl,
				start: 'top 75%',
				toggleActions: 'play none none none'
			}
		});

		if (headingEl) {
			tl.fromTo(
				headingEl,
				{ opacity: 0, y: 30 },
				{ opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
			);
		}

		if (bioEl) {
			const paragraphs = bioEl.querySelectorAll('p');
			tl.fromTo(
				paragraphs,
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.7,
					stagger: 0.15,
					ease: 'power3.out'
				},
				'-=0.4'
			);
		}

		if (statsEl) {
			const statItems = statsEl.querySelectorAll('.stat-item');
			tl.fromTo(
				statItems,
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.6,
					stagger: 0.1,
					ease: 'power3.out'
				},
				'-=0.3'
			);
		}
	});
</script>

<section
	bind:this={sectionEl}
	id="about"
	class="relative px-6 py-24 md:py-32"
>
	<div class="mx-auto max-w-7xl">
		<!-- Section header with line -->
		<div
			bind:this={headingEl}
			class="flex items-baseline justify-between border-b pb-4 opacity-0"
			style:border-color="var(--color-border)"
		>
			<h2
				class="text-xs font-medium uppercase tracking-widest"
				style:color="var(--color-text-tertiary)"
			>
				About
			</h2>
		</div>

		<!-- Content grid -->
		<div class="mt-10 grid grid-cols-1 gap-12 md:grid-cols-12">
			<!-- Left: bio -->
			<div class="md:col-span-4">
				<div bind:this={bioEl}>
					<p
						class="text-2xl leading-relaxed font-light opacity-0 sm:text-3xl"
						style:color="var(--color-text)"
						onmouseenter={() => setCursorVariant('text')}
						onmouseleave={() => resetCursor()}
					>
						I've worn every hat — and I like it that way.
					</p>

					<p
						class="mt-8 text-base leading-relaxed opacity-0"
						style:color="var(--color-text-secondary)"
						onmouseenter={() => setCursorVariant('text')}
						onmouseleave={() => resetCursor()}
					>
						In <span class="inline rounded px-1 font-semibold" style:background-color="var(--color-bg-alt)" style:color="var(--color-text)">8+ years</span> I've
						designed, coded, and shipped across e-commerce, SaaS, and industrial systems.
						Today I run <span class="inline rounded px-1 font-semibold" style:background-color="var(--color-bg-alt)" style:color="var(--color-text)">Rosenthaler</span>,
						a product studio in Berlin, and lead product as CPO at a
						<span class="inline rounded px-1 font-semibold" style:background-color="var(--color-bg-alt)" style:color="var(--color-text)">stealth startup</span>.
						I move between strategy, design, and code — AI tools wired into every step.
					</p>
				</div>
			</div>

			<!-- Right: stats -->
			<div class="md:col-span-8">
				<div
					bind:this={statsEl}
					class="grid grid-cols-3 gap-8"
					role="list"
				>
					{#each stats as stat (stat.label)}
						<div class="stat-item opacity-0" role="listitem">
							<div
								class="text-3xl font-semibold tracking-tight sm:text-4xl"
								style:color="var(--color-text)"
							>
								{stat.value}
							</div>
							<div
								class="mt-1 text-xs uppercase tracking-wider"
								style:color="var(--color-text-tertiary)"
							>
								{stat.label}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
