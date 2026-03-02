<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '$lib/utils/animations';
	import { setCursorVariant, resetCursor } from '$lib/stores/cursor';

	let sectionEl = $state<HTMLElement | null>(null);
	let nameBlockEl = $state<HTMLDivElement | null>(null);
	let line1El = $state<HTMLDivElement | null>(null);
	let line2WrapEl = $state<HTMLDivElement | null>(null);
	let line2BrightEl = $state<HTMLDivElement | null>(null);
	let subtitleEl = $state<HTMLDivElement | null>(null);
	let ctaEl = $state<HTMLDivElement | null>(null);
	let canvasEl = $state<HTMLCanvasElement | null>(null);

	let mouseX = 0;
	let mouseY = 0;
	let canvasRafId: number | undefined;

	const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	// --- Particle mesh ---
	interface Particle {
		x: number;
		y: number;
		baseX: number;
		baseY: number;
		vx: number;
		vy: number;
		size: number;
	}

	let particles: Particle[] = [];
	const PARTICLE_COUNT = 60;
	const CONNECTION_DIST = 120;
	const MOUSE_RADIUS = 150;

	function initParticles(w: number, h: number): void {
		particles = [];
		for (let i = 0; i < PARTICLE_COUNT; i++) {
			const x = Math.random() * w;
			const y = Math.random() * h;
			particles.push({
				x,
				y,
				baseX: x,
				baseY: y,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				size: Math.random() * 1.5 + 0.5
			});
		}
	}

	function drawParticles(ctx: CanvasRenderingContext2D, w: number, h: number): void {
		ctx.clearRect(0, 0, w, h);

		const canvasRect = canvasEl?.getBoundingClientRect();
		const mx = canvasRect ? mouseX - canvasRect.left : -999;
		const my = canvasRect ? mouseY - canvasRect.top : -999;

		// Update & draw particles
		for (const p of particles) {
			// Drift
			p.x += p.vx;
			p.y += p.vy;

			// Soft boundary bounce
			if (p.x < 0 || p.x > w) p.vx *= -1;
			if (p.y < 0 || p.y > h) p.vy *= -1;
			p.x = Math.max(0, Math.min(w, p.x));
			p.y = Math.max(0, Math.min(h, p.y));

			// Mouse repulsion
			const dx = p.x - mx;
			const dy = p.y - my;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < MOUSE_RADIUS && dist > 0) {
				const force = (1 - dist / MOUSE_RADIUS) * 2;
				p.x += (dx / dist) * force;
				p.y += (dy / dist) * force;
			}

			// Draw dot
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
			ctx.fill();
		}

		// Draw connections
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
		ctx.lineWidth = 0.5;
		for (let i = 0; i < particles.length; i++) {
			for (let j = i + 1; j < particles.length; j++) {
				const dx = particles[i].x - particles[j].x;
				const dy = particles[i].y - particles[j].y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < CONNECTION_DIST) {
					const opacity = (1 - dist / CONNECTION_DIST) * 0.08;
					ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
					ctx.beginPath();
					ctx.moveTo(particles[i].x, particles[i].y);
					ctx.lineTo(particles[j].x, particles[j].y);
					ctx.stroke();
				}
			}
		}

		canvasRafId = requestAnimationFrame(() => drawParticles(ctx, w, h));
	}

	// --- Scramble ---
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

	// --- Mouse handlers ---
	function onMouseMove(e: MouseEvent): void {
		mouseX = e.clientX;
		mouseY = e.clientY;

		if (!line2WrapEl || !nameBlockEl) return;

		// Spotlight
		const rect = line2WrapEl.getBoundingClientRect();
		line2WrapEl.style.setProperty('--mx', `${e.clientX - rect.left}px`);
		line2WrapEl.style.setProperty('--my', `${e.clientY - rect.top}px`);

		// 3D tilt
		const blockRect = nameBlockEl.getBoundingClientRect();
		const centerX = blockRect.left + blockRect.width / 2;
		const centerY = blockRect.top + blockRect.height / 2;
		const rotateY = ((e.clientX - centerX) / blockRect.width) * 4;
		const rotateX = ((e.clientY - centerY) / blockRect.height) * -3;

		gsap.to(nameBlockEl, {
			rotateX,
			rotateY,
			duration: 0.5,
			ease: 'power2.out',
			overwrite: 'auto'
		});
	}

	function onMouseLeave(): void {
		if (!nameBlockEl) return;
		gsap.to(nameBlockEl, {
			rotateX: 0,
			rotateY: 0,
			duration: 0.8,
			ease: 'elastic.out(1, 0.5)'
		});
	}

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// --- Canvas setup ---
		if (canvasEl) {
			const ctx = canvasEl.getContext('2d');
			if (ctx) {
				const resize = () => {
					const parent = canvasEl!.parentElement;
					if (!parent) return;
					const dpr = window.devicePixelRatio || 1;
					const w = parent.clientWidth;
					const h = parent.clientHeight;
					canvasEl!.width = w * dpr;
					canvasEl!.height = h * dpr;
					canvasEl!.style.width = `${w}px`;
					canvasEl!.style.height = `${h}px`;
					ctx.scale(dpr, dpr);
					initParticles(w, h);
				};
				resize();
				window.addEventListener('resize', resize);

				// Start drawing after a short delay to match the intro timeline
				setTimeout(() => {
					drawParticles(ctx, canvasEl!.parentElement!.clientWidth, canvasEl!.parentElement!.clientHeight);
				}, 600);
			}
		}

		// --- Intro timeline ---
		const tl = gsap.timeline({ delay: 0.3 });

		if (line1El) {
			line1El.textContent = '';
			tl.add(() => {
				scrambleText(line1El!, 'Maximilian', 900);
			});
		}

		if (line2WrapEl) {
			tl.fromTo(
				line2WrapEl,
				{ opacity: 0 },
				{ opacity: 1, duration: 0.8, ease: 'power2.out' },
				'-=0.4'
			);
		}

		if (subtitleEl) {
			tl.fromTo(
				subtitleEl,
				{ opacity: 0, y: 8 },
				{ opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
				'-=0.3'
			);
		}

		if (ctaEl) {
			tl.fromTo(
				ctaEl,
				{ opacity: 0 },
				{ opacity: 1, duration: 0.4, ease: 'power2.out' },
				'-=0.2'
			);
		}

		// Canvas fade in
		if (canvasEl) {
			tl.fromTo(
				canvasEl,
				{ opacity: 0 },
				{ opacity: 1, duration: 1, ease: 'power2.out' },
				'-=1'
			);
		}

		// Scroll parallax
		if (line1El && line2WrapEl && sectionEl) {
			gsap.to(line1El, {
				y: -40,
				ease: 'none',
				scrollTrigger: {
					trigger: sectionEl,
					start: 'top top',
					end: 'bottom top',
					scrub: true
				}
			});

			gsap.to(line2WrapEl, {
				y: 50,
				ease: 'none',
				scrollTrigger: {
					trigger: sectionEl,
					start: 'top top',
					end: 'bottom top',
					scrub: true
				}
			});
		}

		return () => {
			if (canvasRafId) cancelAnimationFrame(canvasRafId);
		};
	});

	function scrollToAbout(): void {
		const el = document.getElementById('about');
		el?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="sticky top-0 z-0">
	<section
		bind:this={sectionEl}
		class="relative flex h-screen flex-col justify-center overflow-hidden px-6"
		id="hero"
		style:background-color="var(--color-bg)"
		onmousemove={onMouseMove}
		onmouseleave={onMouseLeave}
	>
		<!-- Particle mesh — right side -->
		<div class="pointer-events-none absolute top-0 right-0 bottom-0 w-1/2 md:w-[55%]">
			<canvas
				bind:this={canvasEl}
				class="h-full w-full opacity-0"
			></canvas>
		</div>

		<!-- Name block -->
		<div style="perspective: 1200px;">
			<div
				bind:this={nameBlockEl}
				class="relative z-10 mx-auto w-full max-w-7xl"
				style:transform-style="preserve-3d"
			>
				<!-- First name -->
				<div
					bind:this={line1El}
					class="text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] font-light tracking-tight select-none"
					style:color="var(--color-text)"
					style:font-variant-ligatures="none"
				>
					Maximilian
				</div>

				<!-- Last name — spotlight -->
				<div
					bind:this={line2WrapEl}
					class="hero-spotlight relative opacity-0"
					style="--mx: 50%; --my: 50%;"
				>
					<!-- Faint base -->
					<div
						class="text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] font-bold tracking-tight select-none"
						style:color="var(--color-bg)"
						style:-webkit-text-stroke="2px var(--color-text)"
						style:opacity="0.25"
						style:paint-order="stroke fill"
					>
						Gravemeyer
					</div>
					<!-- Bright layer -->
					<div
						bind:this={line2BrightEl}
						class="hero-spotlight-bright absolute inset-0 text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] font-bold tracking-tight select-none"
						style:color="var(--color-bg)"
						style:-webkit-text-stroke="2px var(--color-text)"
						style:paint-order="stroke fill"
					>
						Gravemeyer
					</div>
				</div>

				<!-- Location -->
				<div
					bind:this={subtitleEl}
					class="mt-6 flex items-center gap-3 opacity-0"
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
		</div>

		<!-- Scroll CTA -->
		<div
			bind:this={ctaEl}
			class="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0"
		>
			<button
				onclick={scrollToAbout}
				onmouseenter={() => setCursorVariant('hover')}
				onmouseleave={() => resetCursor()}
				class="flex flex-col items-center gap-1.5 text-xs"
				style:color="var(--color-text-tertiary)"
			>
				<span>Scroll</span>
				<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
					<path d="M6 1V11M6 11L1 6M6 11L11 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</button>
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
