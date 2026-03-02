<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '$lib/utils/animations';
	import { setCursorVariant, resetCursor } from '$lib/stores/cursor';

	let sectionEl = $state<HTMLElement | null>(null);
	let headlineEl = $state<HTMLDivElement | null>(null);
	let ctaEl = $state<HTMLDivElement | null>(null);

	const headlineWords = "Let's build something great".split(' ');

	const links = [
		{ label: 'Email', href: 'mailto:maximilian@gravemeyer.com' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/mgravemeyer/' },
		{ label: 'GitHub', href: 'https://github.com/mgravemeyer' }
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

		if (headlineEl) {
			const wordEls = headlineEl.querySelectorAll('.word-inner');
			tl.fromTo(
				wordEls,
				{ y: '120%' },
				{
					y: '0%',
					duration: 0.8,
					stagger: 0.06,
					ease: 'power3.out'
				}
			);
		}

		if (ctaEl) {
			tl.fromTo(
				ctaEl,
				{ opacity: 0, y: 20 },
				{ opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
				'-=0.3'
			);
		}

	});
</script>

<section
	bind:this={sectionEl}
	id="contact"
	class="relative px-6 py-24 md:py-32"
	style="background-color: #1a1a1a;"
>
	<div class="mx-auto max-w-7xl">
		<!-- Section header with line -->
		<div
			class="border-b pb-4"
			style="border-color: rgba(255, 255, 255, 0.15);"
		>
			<h2
				class="text-xs font-medium uppercase tracking-widest"
				style="color: rgba(255, 255, 255, 0.5);"
			>
				Contact
			</h2>
		</div>

		<!-- Content grid -->
		<div class="mt-10 grid grid-cols-1 gap-12 md:grid-cols-12">
			<!-- Left: headline -->
			<div class="md:col-span-5">
				<div
					bind:this={headlineEl}
					class="text-4xl leading-tight font-bold tracking-tight sm:text-5xl md:text-6xl"
					style="color: #ffffff;"
				>
					{#each headlineWords as word, i (i)}
						<span class="inline-block overflow-hidden" style:margin-right={i < headlineWords.length - 1 ? '0.25em' : '0'}>
							<span class="word-inner inline-block">{word}</span>
						</span>
					{/each}
				</div>
			</div>

			<!-- Right: links + availability -->
			<div class="md:col-span-7">
				<div
					bind:this={ctaEl}
					class="opacity-0"
				>
					<!-- Availability indicator -->
					<div class="mb-8 flex items-center gap-2">
						<span class="relative flex h-2.5 w-2.5">
							<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
							<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
						</span>
						<span
							class="text-sm font-medium"
							style="color: rgba(255, 255, 255, 0.7);"
						>
							Open to collaborate
						</span>
					</div>

					<div class="flex flex-wrap items-center gap-6">
						{#each links as link (link.label)}
							<a
								href={link.href}
								target={link.href.startsWith('mailto') ? undefined : '_blank'}
								rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
								class="group flex items-center gap-2 border-b pb-1 text-sm font-medium transition-colors duration-300"
								style="border-color: rgba(255, 255, 255, 0.2); color: #ffffff;"
								onmouseenter={() => setCursorVariant('hover')}
								onmouseleave={() => resetCursor()}
							>
								{link.label}
								<svg
									width="12"
									height="12"
									viewBox="0 0 12 12"
									fill="none"
									class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								>
									<path
										d="M1 11L11 1M11 1H3M11 1V9"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</a>
						{/each}
					</div>

					<p
						class="mt-10 text-sm leading-relaxed"
						style="color: rgba(255, 255, 255, 0.4);"
					>
						Based in Berlin, Germany. Usually respond within 24 hours.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<div
		class="mx-auto mt-32 flex max-w-7xl items-center justify-between border-t px-6 pt-8"
		style="border-color: rgba(255, 255, 255, 0.15);"
	>
		<span class="text-xs" style="color: rgba(255, 255, 255, 0.4);">
			&copy; {new Date().getFullYear()} Maximilian Gravemeyer
		</span>
		<div class="flex items-center gap-4">
			<a
				href="/impressum"
				class="text-xs transition-colors duration-200 hover:underline"
				style="color: rgba(255, 255, 255, 0.4);"
			>
				Impressum
			</a>
			<a
				href="/datenschutz"
				class="text-xs transition-colors duration-200 hover:underline"
				style="color: rgba(255, 255, 255, 0.4);"
			>
				Datenschutz
			</a>
		</div>
	</div>
</section>
