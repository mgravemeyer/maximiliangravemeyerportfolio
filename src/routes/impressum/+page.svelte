<svelte:head>
	<title>Impressum — Maximilian Gravemeyer</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="legal">
	<h1>Impressum</h1>
	<p class="label">Angaben gemäß § 5 DDG</p>
	<p>
		Maximilian Gravemeyer Softwareentwicklung und Design<br />
		Zehdenicker Straße 15<br />
		10119 Berlin<br />
		Deutschland
	</p>
	<p>E-Mail: <a href="mailto:maximilian@gravemeyer.com">maximilian@gravemeyer.com</a></p>

	<h2>Verantwortlich für den Inhalt</h2>
	<p>Nach § 18 Abs. 2 MStV: Maximilian Gravemeyer, Anschrift wie oben.</p>

	<h2>Verbraucherstreitbeilegung</h2>
	<p>
		Ich bin nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
		Verbraucherschlichtungsstelle teilzunehmen.
	</p>

	<p class="back"><a href="/">← Zurück</a></p>
</section>

<style>
	.legal {
		max-width: 42rem;
		margin: 0 auto;
		padding: 9rem 1.5rem 6rem;
		color: var(--color-text);
	}
	h1 {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 2rem;
	}
	h2 {
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-secondary);
		margin: 2rem 0 0.5rem;
	}
	p {
		line-height: 1.6;
		margin-bottom: 1rem;
	}
	.label {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-secondary);
	}
	a {
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-color: var(--color-border);
	}
	a:hover {
		text-decoration-color: var(--color-text);
	}
	.back {
		margin-top: 3rem;
	}
</style>
