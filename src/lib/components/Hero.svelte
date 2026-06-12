<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '$lib/utils/animations';
	import DinoGame from '$lib/components/DinoGame.svelte';

	let sectionEl = $state<HTMLElement | null>(null);
	let line1El = $state<HTMLDivElement | null>(null);
	let line2WrapEl = $state<HTMLDivElement | null>(null);
	let subtitleEl = $state<HTMLDivElement | null>(null);
	let blobsEl = $state<HTMLDivElement | null>(null);
	let noiseEl = $state<HTMLDivElement | null>(null);

	const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	// --- Scramble decode ---
	function scrambleText(el: HTMLElement, finalText: string, duration: number = 900): Promise<void> {
		return new Promise((resolve) => {
			const length = finalText.length;
			const startTime = performance.now();

			function update() {
				const elapsed = performance.now() - startTime;
				const progress = Math.min(elapsed / duration, 1);

				let result = '';
				for (let i = 0; i < length; i++) {
					if (finalText[i] === ' ') {
						result += ' ';
						continue;
					}
					const charThreshold = i / length;
					if (progress > charThreshold + 0.3) {
						result += finalText[i];
					} else if (progress > charThreshold - 0.1) {
						result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
					} else {
						result += '\u00A0';
					}
				}

				el.textContent = result;

				if (progress < 1) {
					requestAnimationFrame(update);
				} else {
					el.textContent = finalText;
					resolve();
				}
			}

			requestAnimationFrame(update);
		});
	}

	// --- Noise texture (canvas-based, generated once) ---
	function generateNoise(): string {
		const canvas = document.createElement('canvas');
		canvas.width = 256;
		canvas.height = 256;
		const ctx = canvas.getContext('2d')!;
		const imageData = ctx.createImageData(256, 256);
		for (let i = 0; i < imageData.data.length; i += 4) {
			const val = Math.random() * 255;
			imageData.data[i] = val;
			imageData.data[i + 1] = val;
			imageData.data[i + 2] = val;
			imageData.data[i + 3] = 18;
		}
		ctx.putImageData(imageData, 0, 0);
		return canvas.toDataURL('image/png');
	}

	// --- Spotlight mouse tracking ---
	function onMouseMove(e: MouseEvent): void {
		if (!line2WrapEl) return;
		const rect = line2WrapEl.getBoundingClientRect();
		line2WrapEl.style.setProperty('--mx', `${e.clientX - rect.left}px`);
		line2WrapEl.style.setProperty('--my', `${e.clientY - rect.top}px`);
	}

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Generate noise texture
		if (noiseEl) {
			const noiseUrl = generateNoise();
			noiseEl.style.backgroundImage = `url(${noiseUrl})`;
			noiseEl.style.backgroundSize = '256px 256px';
		}

		// Animate blobs — desynchronized axes create organic motion
		if (blobsEl) {
			const blobs = blobsEl.querySelectorAll<HTMLElement>('.hero-blob');
			blobs.forEach((blob, i) => {
				const xDist = 40 + i * 20;
				const yDist = 30 + i * 15;

				gsap.to(blob, {
					x: xDist,
					duration: 18 + i * 4,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut'
				});
				gsap.to(blob, {
					y: -yDist,
					duration: 14 + i * 5,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut',
					delay: i * 2
				});
				gsap.to(blob, {
					scale: 1.1 + i * 0.05,
					duration: 20 + i * 3,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut',
					delay: i
				});
			});
		}

		// --- Intro timeline ---
		const tl = gsap.timeline({ delay: 0.3 });

		// Blobs fade in
		if (blobsEl) {
			tl.fromTo(
				blobsEl,
				{ opacity: 0 },
				{ opacity: 1, duration: 1.5, ease: 'power2.out' }
			);
		}

		// Scramble first name
		if (line1El) {
			line1El.textContent = '';
			tl.add(() => {
				scrambleText(line1El!, 'Maximilian', 900);
			}, '-=1');
		}

		// Last name fade in
		if (line2WrapEl) {
			tl.fromTo(
				line2WrapEl,
				{ opacity: 0 },
				{ opacity: 1, duration: 0.8, ease: 'power2.out' },
				'-=0.4'
			);
		}

		// Subtitle
		if (subtitleEl) {
			tl.fromTo(
				subtitleEl,
				{ opacity: 0, y: 10 },
				{ opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
				'-=0.3'
			);
		}

		// Scroll parallax — raw scroll positions since hero is sticky
		const vh = window.innerHeight;
		if (line1El && line2WrapEl) {
			gsap.to(line1El, {
				y: 90,
				ease: 'none',
				scrollTrigger: {
					scrub: true,
					start: 0,
					end: vh
				}
			});

			gsap.to(line2WrapEl, {
				y: 90,
				ease: 'none',
				scrollTrigger: {
					scrub: true,
					start: 0,
					end: vh
				}
			});
		}
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="sticky top-0 z-0">
	<section
		bind:this={sectionEl}
		class="relative flex h-screen flex-col justify-center overflow-hidden px-6"
		id="hero"
		style:background-color="var(--color-bg)"
		onmousemove={onMouseMove}
	>
		<!-- Animated gradient blobs -->
		<div
			bind:this={blobsEl}
			class="pointer-events-none absolute inset-0 overflow-hidden opacity-0"
		>
			<div
				class="hero-blob absolute left-[10%] top-[15%] h-[50vw] w-[50vw] rounded-full"
				style="background: radial-gradient(circle, rgba(0,0,0,0.04) 0%, transparent 70%);"
			></div>
			<div
				class="hero-blob absolute right-[5%] top-[25%] h-[40vw] w-[40vw] rounded-full"
				style="background: radial-gradient(circle, rgba(99,102,241,0.045) 0%, transparent 70%);"
			></div>
			<div
				class="hero-blob absolute left-[35%] bottom-[5%] h-[45vw] w-[45vw] rounded-full"
				style="background: radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%);"
			></div>
		</div>

		<!-- Noise texture overlay -->
		<div
			bind:this={noiseEl}
			class="pointer-events-none absolute inset-0 opacity-[0.04]"
			style="mix-blend-mode: multiply;"
		></div>

		<!-- Content -->
		<div class="relative z-10 mx-auto w-full max-w-7xl">
			<!-- First name — scramble decode -->
			<div
				bind:this={line1El}
				class="text-[clamp(3rem,10vw,8rem)] leading-[0.9] font-light tracking-tight select-none"
				style:color="var(--color-text)"
				style:font-variant-ligatures="none"
			>
				Maximilian
			</div>

			<!-- Last name + Dino game row -->
			<div class="flex items-end gap-6">
				<!-- Last name — spotlight reveal -->
				<div
					bind:this={line2WrapEl}
					class="relative opacity-0"
					style="--mx: 50%; --my: 50%;"
				>
					<!-- Faint base layer (outline only) -->
					<div
						class="text-[clamp(3rem,10vw,8rem)] leading-[0.95] font-bold tracking-tight select-none"
						style="color: var(--color-bg); -webkit-text-stroke: 2px var(--color-text); paint-order: stroke fill; opacity: 0.2;"
					>
						Gravemeyer
					</div>
					<!-- Bright layer — outline revealed by cursor spotlight -->
					<div
						class="hero-spotlight-bright absolute inset-0 text-[clamp(3rem,10vw,8rem)] leading-[0.95] font-bold tracking-tight select-none"
						style="color: var(--color-bg); -webkit-text-stroke: 2px var(--color-text); paint-order: stroke fill;"
					>
						Gravemeyer
					</div>
				</div>

				<!-- Dino game -->
				<div class="hidden pb-2 lg:block">
					<DinoGame />
				</div>
			</div>

			<!-- Location -->
			<div
				bind:this={subtitleEl}
				class="mt-6 flex items-center gap-3 opacity-0 md:mt-8"
			>
				<span
					class="h-px w-8"
					style:background-color="var(--color-border)"
				></span>
				<span
					class="text-sm uppercase tracking-[0.15em]"
					style:color="var(--color-text-tertiary)"
				>
					Berlin
				</span>
			</div>
		</div>
	</section>
</div>

<style>
	.hero-spotlight-bright {
		-webkit-mask-image: radial-gradient(
			circle 180px at var(--mx) var(--my),
			black 0%,
			transparent 100%
		);
		mask-image: radial-gradient(
			circle 180px at var(--mx) var(--my),
			black 0%,
			transparent 100%
		);
	}
</style>
