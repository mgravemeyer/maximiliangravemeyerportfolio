<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	let canvas = $state<HTMLCanvasElement | null>(null);
	let gameStarted = $state(false);
	let gameOver = $state(false);
	let score = $state(0);
	let animFrameId: number;

	// Game constants
	const W = 300;
	const H = 80;
	const GROUND_Y = 62;
	const GRAVITY = 0.6;
	const JUMP_FORCE = -10;
	const DINO_W = 20;
	const DINO_H = 22;
	const CACTUS_W = 10;
	const MIN_CACTUS_H = 16;
	const MAX_CACTUS_H = 28;

	// Game state
	let dino = { x: 30, y: GROUND_Y - DINO_H, vy: 0, jumping: false };
	let obstacles: { x: number; h: number; scored: boolean }[] = [];
	let groundOffset = 0;
	let speed = 3;
	let frameCount = 0;

	function reset() {
		dino = { x: 30, y: GROUND_Y - DINO_H, vy: 0, jumping: false };
		obstacles = [];
		groundOffset = 0;
		speed = 3;
		frameCount = 0;
		score = 0;
		gameOver = false;
	}

	function spawnCactus() {
		const h = MIN_CACTUS_H + Math.random() * (MAX_CACTUS_H - MIN_CACTUS_H);
		obstacles.push({ x: W + 10, h, scored: false });
	}

	function drawDino(ctx: CanvasRenderingContext2D) {
		const x = dino.x;
		const y = dino.y;
		const color = getComputedStyle(canvas!).getPropertyValue('--color-text').trim() || '#1a1a1a';
		ctx.fillStyle = color;

		// Body
		ctx.fillRect(x + 6, y + 4, 12, 12);
		// Head
		ctx.fillRect(x + 10, y, 10, 8);
		// Eye (knockout)
		ctx.fillStyle = getComputedStyle(canvas!).getPropertyValue('--color-bg').trim() || '#fafafa';
		ctx.fillRect(x + 16, y + 2, 2, 2);
		ctx.fillStyle = color;
		// Mouth
		ctx.fillRect(x + 14, y + 6, 6, 1);
		// Tail
		ctx.fillRect(x + 2, y + 6, 6, 4);
		ctx.fillRect(x, y + 4, 4, 4);

		// Legs (animated)
		if (!dino.jumping) {
			if (Math.floor(frameCount / 5) % 2 === 0) {
				ctx.fillRect(x + 8, y + 16, 3, 6);
				ctx.fillRect(x + 14, y + 16, 3, 4);
			} else {
				ctx.fillRect(x + 8, y + 16, 3, 4);
				ctx.fillRect(x + 14, y + 16, 3, 6);
			}
		} else {
			ctx.fillRect(x + 8, y + 16, 3, 5);
			ctx.fillRect(x + 14, y + 16, 3, 5);
		}
	}

	function drawCactus(ctx: CanvasRenderingContext2D, obs: { x: number; h: number }) {
		const color = getComputedStyle(canvas!).getPropertyValue('--color-text').trim() || '#1a1a1a';
		ctx.fillStyle = color;
		const y = GROUND_Y - obs.h;
		// Trunk
		ctx.fillRect(obs.x + 3, y, 4, obs.h);
		// Arms
		if (obs.h > 20) {
			ctx.fillRect(obs.x, y + 6, 3, 4);
			ctx.fillRect(obs.x, y + 4, 2, 4);
			ctx.fillRect(obs.x + 7, y + 10, 3, 4);
			ctx.fillRect(obs.x + 8, y + 8, 2, 4);
		}
	}

	function drawGround(ctx: CanvasRenderingContext2D) {
		const color = getComputedStyle(canvas!).getPropertyValue('--color-text').trim() || '#1a1a1a';
		ctx.strokeStyle = color;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0, GROUND_Y + 0.5);
		ctx.lineTo(W, GROUND_Y + 0.5);
		ctx.stroke();

		// Ground texture bumps
		ctx.fillStyle = color;
		for (let i = 0; i < 20; i++) {
			const bx = ((i * 19 + 7) - groundOffset) % W;
			if (bx > 0) {
				ctx.fillRect(bx, GROUND_Y + 3, 2, 1);
			}
		}
	}

	function checkCollision(obs: { x: number; h: number }): boolean {
		const dinoLeft = dino.x + 6;
		const dinoRight = dino.x + 18;
		const dinoTop = dino.y + 2;
		const dinoBottom = dino.y + DINO_H;

		const obsLeft = obs.x + 2;
		const obsRight = obs.x + CACTUS_W - 2;
		const obsTop = GROUND_Y - obs.h;
		const obsBottom = GROUND_Y;

		return dinoRight > obsLeft && dinoLeft < obsRight && dinoBottom > obsTop && dinoTop < obsBottom;
	}

	function gameLoop() {
		if (!canvas) return;
		const ctx = canvas.getContext('2d')!;
		const dpr = window.devicePixelRatio || 1;

		ctx.clearRect(0, 0, W * dpr, H * dpr);
		ctx.save();
		ctx.scale(dpr, dpr);

		if (gameOver) {
			drawGround(ctx);
			drawDino(ctx);
			obstacles.forEach((o) => drawCactus(ctx, o));

			// Game over text
			const color = getComputedStyle(canvas!).getPropertyValue('--color-text').trim() || '#1a1a1a';
			ctx.fillStyle = color;
			ctx.font = '10px Inter, system-ui, sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText('GAME OVER', W / 2, 30);
			ctx.font = '8px Inter, system-ui, sans-serif';
			ctx.fillText('SPACE to restart', W / 2, 42);
			ctx.restore();
			return;
		}

		if (!gameStarted) {
			drawGround(ctx);
			drawDino(ctx);
			const color = getComputedStyle(canvas!).getPropertyValue('--color-text').trim() || '#1a1a1a';
			ctx.fillStyle = color;
			ctx.font = '8px Inter, system-ui, sans-serif';
			ctx.textAlign = 'center';
			ctx.globalAlpha = 0.5;
			ctx.fillText('SPACE to play', W / 2, 30);
			ctx.globalAlpha = 1;
			ctx.restore();
			animFrameId = requestAnimationFrame(gameLoop);
			return;
		}

		frameCount++;

		// Speed up over time
		speed = 3 + Math.floor(score / 5) * 0.3;

		// Dino physics
		if (dino.jumping) {
			dino.vy += GRAVITY;
			dino.y += dino.vy;
			if (dino.y >= GROUND_Y - DINO_H) {
				dino.y = GROUND_Y - DINO_H;
				dino.vy = 0;
				dino.jumping = false;
			}
		}

		// Move ground
		groundOffset = (groundOffset + speed) % W;

		// Spawn obstacles
		const minGap = Math.max(80, 140 - score * 2);
		const lastObs = obstacles[obstacles.length - 1];
		if (!lastObs || lastObs.x < W - minGap) {
			if (Math.random() < 0.02 + Math.min(score * 0.002, 0.04)) {
				spawnCactus();
			}
		}

		// Move & check obstacles
		for (let i = obstacles.length - 1; i >= 0; i--) {
			obstacles[i].x -= speed;

			if (!obstacles[i].scored && obstacles[i].x + CACTUS_W < dino.x) {
				obstacles[i].scored = true;
				score++;
			}

			if (checkCollision(obstacles[i])) {
				gameOver = true;
			}

			if (obstacles[i].x < -CACTUS_W - 10) {
				obstacles.splice(i, 1);
			}
		}

		// Draw
		drawGround(ctx);
		obstacles.forEach((o) => drawCactus(ctx, o));
		drawDino(ctx);

		// Score
		const color = getComputedStyle(canvas!).getPropertyValue('--color-text').trim() || '#1a1a1a';
		ctx.fillStyle = color;
		ctx.font = '9px Inter, system-ui, sans-serif';
		ctx.textAlign = 'right';
		ctx.globalAlpha = 0.4;
		ctx.fillText(String(score).padStart(4, '0'), W - 6, 12);
		ctx.globalAlpha = 1;

		ctx.restore();

		if (!gameOver) {
			animFrameId = requestAnimationFrame(gameLoop);
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.code !== 'Space') return;

		// Only prevent default when the game canvas is visible / in viewport
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const inView = rect.top < window.innerHeight && rect.bottom > 0;
		if (!inView) return;

		e.preventDefault();

		if (!gameStarted) {
			gameStarted = true;
			reset();
			animFrameId = requestAnimationFrame(gameLoop);
			return;
		}

		if (gameOver) {
			reset();
			gameStarted = true;
			animFrameId = requestAnimationFrame(gameLoop);
			return;
		}

		if (!dino.jumping) {
			dino.jumping = true;
			dino.vy = JUMP_FORCE;
		}
	}

	onMount(() => {
		if (canvas) {
			const dpr = window.devicePixelRatio || 1;
			canvas.width = W * dpr;
			canvas.height = H * dpr;
			canvas.style.width = `${W}px`;
			canvas.style.height = `${H}px`;
		}

		window.addEventListener('keydown', handleKeyDown);
		animFrameId = requestAnimationFrame(gameLoop);
	});

	onDestroy(() => {
		if (!browser) return;
		window.removeEventListener('keydown', handleKeyDown);
		if (animFrameId) cancelAnimationFrame(animFrameId);
	});
</script>

{#if browser}
<div class="dino-game-wrapper">
	<canvas
		bind:this={canvas}
		class="dino-canvas"
		style="--color-text: var(--color-text); --color-bg: var(--color-bg);"
	></canvas>
</div>
{/if}

<style>
	.dino-game-wrapper {
		display: inline-flex;
		align-items: flex-end;
		margin-left: 1.5rem;
		opacity: 0.6;
		transition: opacity 0.3s ease;
	}

	.dino-game-wrapper:hover {
		opacity: 1;
	}

	.dino-canvas {
		display: block;
		border-radius: 4px;
	}
</style>