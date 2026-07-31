# Portfolio "loud" redesign — landonorris.com direction

Date: 2026-07-30. Approved by Ryan in session.

## Goal
Restyle the existing static portfolio (plain HTML/CSS/JS, GitHub Pages, GSAP) to match the energy of landonorris.com: alternating full-bleed color blocks, giant mixed typography, marquee bands, signature scribble, captioned cards. Cursor-parallax hero stays.

## Palette
- Cream `#f2efe9` — light blocks (hero, work)
- Warm near-black ink `#141210` — dark blocks (statement, signature, contact)
- Ferrari red `#e10600` — accents, marquee bands, signature, links (replaces both the old amber and the reference site's volt lime)
- Faint topographic contour-line pattern on both block types

## Typography
- Anton — heavy condensed display caps
- Playfair Display Italic — serif accent words spliced into headlines, red
- Archivo — body; IBM Plex Mono — labels, badges, captions
- Two-tone mixed headlines (heavy caps + red serif italic) are the core device

## Amendments (same day, per Ryan)
- Location is Spanish Fork, UT (40.11°N — 111.65°W), not Salt Lake City.
- Copy is generic software-developer, not energy-themed: statement is "I turn ideas into shipped software."; marquees are "From idea to production / Design — Code — Ship" and "Ryan Hillstead — Software Developer".
- Signature section (item 4 below) removed entirely.
- Contact email is rkhillstead@gmail.com.

## Structure
1. Hero (cream): parallax layers kept — recolored contour/tower background, subject cutout centered, stacked wordmark (serif "Ryan" / heavy "HILLSTEAD"), floating badge chips ("SALT LAKE CITY 40.76°N — 111.89°W", "NOW BUILDING → COLLECTORS VAULT"), scroll cue.
2. Red marquee band: infinite ticker "KEEPING THE LIGHTS ON — SOFTWARE FOR THE GRID —".
3. Statement (dark): giant manifesto, Anton caps in cream with "lights" in red Playfair italic.
4. Signature moment (dark): duotone-framed headshot with red SVG signature scribble drawn over it, "MESSAGE FROM RYAN" label.
5. Work (cream): real GitHub projects only (Collectors Vault, Discord Bot, First Website, this site), cards link to the repos, mono captions ("2026 · TYPESCRIPT"), red hover accents. Per Ryan: no invented projects.
6. Contact (dark): giant red serif-italic email, second marquee, footer meta.

## Motion (moderate)
- Keep: GSAP intro timeline, cursor parallax (lerp/ticker), ScrollTrigger section reveals.
- Add: CSS-keyframe infinite marquees; signature stroke-draw on scroll (one-time).
- No per-element scroll choreography. `prefers-reduced-motion`: marquees paused, everything visible.

## Constraints
- No build step; single index.html/style.css/script.js + assets/. GSAP via CDN.
- Content unchanged (About/Work/Contact copy, email, GitHub link).
