/* ============================================================
   Ryan Hillstead — portfolio
   GSAP intro, scroll reveals, and lerp-smoothed cursor parallax
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

/* ---------- intro sequence ---------- */

if (reducedMotion) {
  gsap.set("[data-intro]", { clearProps: "all" });
} else {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from('[data-intro="line"]', {
      yPercent: 110,
      duration: 1.1,
      stagger: 0.12,
    })
    .from('[data-intro="eyebrow"]', { opacity: 0, y: 12, duration: 0.6 }, "-=0.7")
    .from('[data-intro="subject"]', { opacity: 0, y: 60, duration: 1.1 }, "-=0.9")
    .from('[data-intro="fg"]', {
      opacity: 0,
      y: 24,
      duration: 0.7,
      stagger: 0.08,
    }, "-=0.7")
    .from('[data-intro="nav"], [data-intro="cue"]', { opacity: 0, duration: 0.6 }, "-=0.4");
}

/* ---------- cursor parallax ----------
   mousemove only updates the *target*; a gsap.ticker (rAF) loop
   lerps the current position toward it every frame, so the layers
   trail the cursor smoothly instead of snapping. Each layer's
   data-depth-x / data-depth-y is its max travel in px. */

if (!reducedMotion && finePointer) {
  const layers = Array.from(document.querySelectorAll("[data-depth-x]")).map((el) => ({
    depthX: parseFloat(el.dataset.depthX),
    depthY: parseFloat(el.dataset.depthY),
    setX: gsap.quickSetter(el, "x", "px"),
    setY: gsap.quickSetter(el, "y", "px"),
  }));

  const target = { x: 0, y: 0 }; // cursor position, normalized to [-1, 1]
  const current = { x: 0, y: 0 };

  window.addEventListener("mousemove", (e) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
  });

  document.documentElement.addEventListener("mouseleave", () => {
    target.x = 0;
    target.y = 0;
  });

  const SMOOTHING = 4; // higher = snappier trail

  gsap.ticker.add((time, deltaTime) => {
    // frame-rate independent lerp factor
    const t = 1 - Math.exp((-SMOOTHING * deltaTime) / 1000);
    current.x += (target.x - current.x) * t;
    current.y += (target.y - current.y) * t;

    for (const layer of layers) {
      layer.setX(current.x * layer.depthX);
      layer.setY(current.y * layer.depthY);
    }
  });
}

/* ---------- scroll reveals ---------- */

if (reducedMotion) {
  gsap.set(".reveal", { clearProps: "all" });
} else {
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 36,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    });
  });
}

/* ---------- cursor reveal ----------
   A soft circular mask on .subject-alt follows the cursor, revealing the
   TRON program layer under the headshot. The radius eases in when the
   pointer is over the hero and out when it leaves. Mask coordinates are
   read from the stack's live bounding rect, so they stay correct while the
   parallax transform moves the layer. */

const alt = document.querySelector(".subject-alt");
const stack = document.querySelector(".subject-stack");
const hero = document.querySelector(".hero");

if (alt && stack && hero && finePointer) {
  if (alt.dataset.src) alt.src = alt.dataset.src;

  const REVEAL_RADIUS = 190; // px
  const pointer = { x: 0, y: 0 };
  let targetRadius = 0;
  let radius = 0;

  window.addEventListener("mousemove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    const heroRect = hero.getBoundingClientRect();
    const inHero = e.clientY >= heroRect.top && e.clientY <= heroRect.bottom;
    targetRadius = inHero ? REVEAL_RADIUS : 0;
  });

  document.documentElement.addEventListener("mouseleave", () => {
    targetRadius = 0;
  });

  gsap.ticker.add((time, deltaTime) => {
    const t = 1 - Math.exp((-6 * deltaTime) / 1000);
    radius += (targetRadius - radius) * t;

    const rect = stack.getBoundingClientRect();
    alt.style.setProperty("--mx", `${pointer.x - rect.left}px`);
    alt.style.setProperty("--my", `${pointer.y - rect.top}px`);
    alt.style.setProperty("--reveal-r", `${radius}px`);
  });
}

/* ---------- footer year ---------- */

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- work / home mode toggle ----------
   Flips :root's data-mode, which swaps both palette and content. The
   ScrollTrigger work is not optional: reveal triggers for the hidden side
   were built against display:none boxes, so without a refresh (and a
   clearProps on what just became visible) sections can strand at opacity 0. */

const modeButtons = Array.from(document.querySelectorAll("[data-mode-set]"));

function setMode(mode) {
  document.documentElement.dataset.mode = mode;

  for (const btn of modeButtons) {
    const active = btn.dataset.modeSet === mode;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-checked", String(active));
  }

  gsap.set(`[data-side="${mode}"] .reveal, [data-side="${mode}"].reveal`, {
    clearProps: "all",
  });

  if (window.ScrollTrigger) ScrollTrigger.refresh();
}

for (const btn of modeButtons) {
  btn.addEventListener("click", () => setMode(btn.dataset.modeSet));
}
