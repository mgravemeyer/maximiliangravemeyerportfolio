<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '$lib/utils/animations';
	import { setCursorVariant, resetCursor } from '$lib/stores/cursor';

	let sectionEl = $state<HTMLElement | null>(null);

	interface Role {
		company: string;
		url?: string;
		role: string;
		period: string;
		description: string;
	}

	interface RoleGroup {
		label: string;
		roles: Role[];
	}

	const groups: RoleGroup[] = [
		{
			label: 'Currently',
			roles: [
				{
					company: 'Stealth Startup',
					role: 'CPO',
					period: '2025–Now',
					description: 'Leading product from 0→1 — owning strategy, roadmap, and cross-functional delivery.'
				},
				{
					company: 'Rosenthaler',
					url: 'https://rosenthaler.co',
					role: 'Founder',
					period: '2025–Now',
					description: 'Running an engineering studio in Berlin — helping established companies decide what to build, then building and running it. Clients include HORSCH, Almanach, and Innomarks: from product strategy to systems in production.'
				}
			]
		},
		{
			label: 'Previously',
			roles: [
				{
					company: 'smart',
					role: 'Freelance Designer',
					period: '2025',
					description: 'Designing digital experiences and interface concepts for a connected vehicle platform.'
				},
				{
					company: 'Coffi',
					role: 'Freelance Developer',
					period: '2025',
					description: 'Full-stack development for a specialty coffee platform — storefront, ordering, and payments.'
				},
				{
					company: 'Almanach',
					role: 'Freelance Developer',
					period: '2024–2025',
					description: 'Built a full-stack dashboard with Next.js, Firebase Auth, Stripe payments, and ActiveCampaign tracking.'
				},
				{
					company: 'Tom Tailor',
					role: 'Freelance Developer',
					period: '2021–2023',
					description: 'Developed a headless e-commerce shop in Next.js, collaborating with integration partners in an agile team.'
				},
				{
					company: 'Segler Maschinenfabrik',
					role: 'Freelance Developer',
					period: '2018–2022',
					description: 'Conceptualized, designed, and developed an iOS enterprise app for logging internal processes. Won the \'Zukunftsfest\' award.'
				}
			]
		}
	];

	function formatPeriod(period: string): { before: string; now: boolean } {
		if (period.endsWith('Now')) {
			return { before: period.replace('Now', ''), now: true };
		}
		return { before: period, now: false };
	}

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

		const rows = sectionEl.querySelectorAll('.role-row');
		tl.fromTo(
			rows,
			{ opacity: 0, y: 15 },
			{
				opacity: 1,
				y: 0,
				duration: 0.5,
				stagger: 0.06,
				ease: 'power3.out'
			}
		);
	});
</script>

<section
	bind:this={sectionEl}
	id="work"
	class="relative px-6 py-24 md:py-32"
>
	<div class="mx-auto max-w-7xl">
		<!-- Section header -->
		<div
			class="flex items-baseline justify-between border-b pb-4"
			style:border-color="var(--color-border)"
		>
			<h2
				class="text-xs font-medium uppercase tracking-widest"
				style:color="var(--color-text-tertiary)"
			>
				Experience
			</h2>
			<span
				class="text-xs"
				style:color="var(--color-text-tertiary)"
			>
				Selected roles
			</span>
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
					I think like a product person, work like a designer, and build like an engineer.
				</p>
			</div>

			<!-- Right: grouped roles -->
			<div class="md:col-span-8" role="list">
				{#each groups as group, gi (group.label)}
					<!-- Group label -->
					<div
						class="role-row opacity-0"
						class:mt-8={gi > 0}
						class:mb-2={true}
					>
						<span
							class="text-[11px] font-medium uppercase tracking-widest"
							style:color="var(--color-text-tertiary)"
						>
							{group.label}
						</span>
					</div>

					{#each group.roles as role (role.company)}
						{@const period = formatPeriod(role.period)}
						<div
							class="role-row border-b py-4 opacity-0"
							style:border-color="var(--color-border-light)"
							onmouseenter={() => setCursorVariant('hover')}
							onmouseleave={() => resetCursor()}
							role="listitem"
						>
							<div class="flex items-center justify-between">
								<!-- Company + Role -->
								<div class="flex items-center gap-3">
									{#if role.url}
										<a
											href={role.url}
											target="_blank"
											rel="noopener noreferrer"
											class="group inline-flex items-center gap-1.5 text-sm font-medium"
											style:color="var(--color-text)"
										>
											{role.company}
											<svg width="10" height="10" viewBox="0 0 10 10" fill="none" class="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
												<path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
											</svg>
										</a>
									{:else}
										<span class="text-sm font-medium" style:color="var(--color-text)">
											{role.company}
										</span>
									{/if}
									<span
										class="rounded-full px-2.5 py-0.5 text-xs font-medium"
										style:background-color="var(--color-bg-alt)"
										style:color="var(--color-text)"
									>
										{role.role}
									</span>
								</div>

								<!-- Period -->
								<span class="text-sm" style:color="var(--color-text-tertiary)">
									{#if period.now}
										{period.before}<span class="font-semibold" style:color="var(--color-text-secondary)">Now</span>
									{:else}
										{role.period}
									{/if}
								</span>
							</div>

							<!-- Description -->
							<p
								class="mt-1.5 text-xs leading-relaxed"
								style:color="var(--color-text-tertiary)"
							>
								{role.description}
							</p>
						</div>
					{/each}
				{/each}
			</div>
		</div>
	</div>
</section>
