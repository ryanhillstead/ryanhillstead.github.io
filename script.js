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

/* ---------- footer year ---------- */

document.getElementById("year").textContent = new Date().getFullYear();
