<svelte:head>
	<title>Datenschutz — Maximilian Gravemeyer</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="legal">
	<h1>Datenschutz</h1>

	<h2>Verantwortlicher</h2>
	<p>
		Maximilian Gravemeyer Softwareentwicklung und Design, Zehdenicker Straße 15, 10119 Berlin,
		E-Mail: <a href="mailto:maximilian@gravemeyer.com">maximilian@gravemeyer.com</a>.
	</p>

	<h2>Der Grundsatz</h2>
	<p>
		Diese Seite setzt keine Cookies, betreibt keine Analyse und lädt keine Ressourcen von
		Dritten. Es gibt kein Tracking und keine Profile.
	</p>

	<h2>Hosting und Server-Logs</h2>
	<p>
		Die Seite wird über Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, USA)
		ausgeliefert. Beim Aufruf verarbeitet Vercel technisch notwendige Verbindungsdaten,
		insbesondere die IP-Adresse, Zeitpunkt und angeforderte Ressource (Server-Logs). Das ist
		für die Auslieferung und die Sicherheit der Seite erforderlich (Art. 6 Abs. 1 lit. f
		DSGVO). Die Übermittlung in die USA stützt sich auf das EU-U.S. Data Privacy Framework
		und Standardvertragsklauseln. Logs werden nur kurzfristig vorgehalten.
	</p>

	<h2>Kontaktaufnahme</h2>
	<p>
		Wenn Sie mir eine E-Mail schreiben, verwende ich Ihre Daten ausschließlich, um Ihnen zu
		antworten (Art. 6 Abs. 1 lit. b DSGVO). E-Mails lösche ich, sobald sie für die
		Korrespondenz und gesetzliche Aufbewahrungspflichten nicht mehr nötig sind.
	</p>

	<h2>Ihre Rechte</h2>
	<p>
		Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung
		(Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und
		Widerspruch (Art. 21). Eine formlose E-Mail genügt. Außerdem können Sie sich bei einer
		Aufsichtsbehörde beschweren; zuständig ist die Berliner Beauftragte für Datenschutz und
		Informationsfreiheit, Alt-Moabit 59–61, 10555 Berlin.
	</p>

	<h2>Verschlüsselung</h2>
	<p>Die Seite wird ausschließlich über TLS (HTTPS) ausgeliefert.</p>

	<p class="label">Stand: Juni 2026.</p>

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
