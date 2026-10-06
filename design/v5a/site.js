/* Tiger Auto Parts v5 */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

  /* ---------- finder ---------- */
  const FLEET = {
    BMW: {
      "3 Serie": ["E30", "E36", "E46", "E90", "F30"],
      "1 Serie": ["E87", "F20"],
      "5 Serie": ["E39", "E60", "F10"],
      "4 Serie": ["F32", "F36"],
    },
    MINI: { "Cooper": ["R50", "R53", "R56", "F56"] },
    Porsche: { "911": ["996", "997", "991"], "Cayenne": ["9PA", "92A"] },
    Volkswagen: { "Golf": ["Mk4", "Mk5", "Mk6", "Mk7"], "Polo": ["6R", "AW"] },
    Mercedes: { "C-Klasse": ["W204", "W205"], "A-Klasse": ["W176", "W177"] },
  };
  const finder = $("[data-finder]");
  if (finder) {
    const brand = $("[data-brand]", finder), model = $("[data-model]", finder), chassis = $("[data-chassis]", finder);
    const cta = $("[data-finder-cta]", finder);
    const fill = (sel, items, pick) => {
      sel.innerHTML = items.map((v) => `<option${v === pick ? " selected" : ""}>${v}</option>`).join("");
    };
    const sync = () => { cta.textContent = `Toon ${chassis.value}-onderdelen`; };
    const onModel = () => { fill(chassis, FLEET[brand.value][model.value], brand.value === "BMW" && model.value === "3 Serie" ? "E36" : undefined); sync(); };
    const onBrand = () => { fill(model, Object.keys(FLEET[brand.value])); onModel(); };
    fill(brand, Object.keys(FLEET), "BMW");
    onBrand();
    brand.addEventListener("change", onBrand);
    model.addEventListener("change", onModel);
    chassis.addEventListener("change", sync);

    const tabs = $$("[data-tab]", finder);
    tabs.forEach((t) => t.addEventListener("click", () => {
      tabs.forEach((x) => x.setAttribute("aria-selected", String(x === t)));
      $$("[data-panel]", finder).forEach((p) => (p.hidden = p.dataset.panel !== t.dataset.tab));
      if (t.dataset.tab === "nr") { cta.textContent = "Zoek nummer"; $("input", finder).focus(); } else sync();
    }));
  }

  /* ---------- menu ---------- */
  const burger = $("[data-menu-toggle]"), menu = $("[data-menu]");
  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Menu sluiten" : "Menu openen");
    menu.hidden = !open;
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open && hasGsap && !reduce) gsap.from($$(".menu__links a", menu), { yPercent: 60, opacity: 0, duration: 0.9, stagger: 0.06, ease: "expo.out" });
  };
  burger?.addEventListener("click", () => setMenu(menu.hidden));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- text splitting ---------- */
  $$("[data-split-lines]").forEach((el) => {
    el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i).map((l) => `<span class="line"><span>${l.trim()}</span></span>`).join("");
  });
  $$("[data-split]").forEach((el) => {
    const walk = (node) => [...node.childNodes].map((n) => {
      if (n.nodeType === 3) return n.textContent.split(/(\s+)/).map((w) => (w.trim() ? `<span class="w"><span>${w}</span></span>` : w)).join("");
      const tag = n.tagName.toLowerCase();
      return `<${tag}>${walk(n)}</${tag}>`;
    }).join("");
    el.innerHTML = walk(el);
  });

  const nav = $("[data-nav]");
  if (!hasGsap || reduce) {
    document.documentElement.classList.remove("js");
    addEventListener("scroll", () => nav.classList.toggle("is-solid", scrollY > 40), { passive: true });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const ease = "expo.out";

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id === "#" || id === "#top") {
      if (a.hasAttribute("data-to-finder")) { e.preventDefault(); lenis ? lenis.scrollTo(0, { duration: 1.6 }) : scrollTo(0, 0); setTimeout(() => $("[data-brand]")?.focus({ preventScroll: true }), 1400); }
      return;
    }
    const t = $(id);
    if (!t) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(t, { duration: 1.6 }) : t.scrollIntoView({ behavior: "smooth" });
  }));

  /* ---------- nav ---------- */
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle("is-solid", y > 40);
      nav.classList.toggle("is-hidden", y > 600 && y > lastY && menu.hidden);
      lastY = y;
    },
  });

  /* ---------- hero intro ---------- */
  const heroImg = $("[data-hero-img]");
  const intro = gsap.timeline({ defaults: { ease } });
  intro
    .fromTo(heroImg, { scale: 1.18 }, { scale: 1, duration: 2.6, ease: "expo.out" }, 0)
    .fromTo(".hero__shade", { opacity: 0.4 }, { opacity: 1, duration: 1.6 }, 0)
    .fromTo(".hero__title .line > span", { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.5, stagger: 0.1 }, 0.25)
    .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.7)
    .fromTo(".nav", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1.2 }, 0.5);

  gsap.to(heroImg, {
    yPercent: 10, ease: "none",
    scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero__body, .hero__top", {
    yPercent: -30, opacity: 0, ease: "none",
    scrollTrigger: { trigger: "[data-hero]", start: "40% top", end: "bottom top", scrub: true },
  });

  /* ---------- reveals ---------- */
  $$("[data-split]").forEach((el) => {
    gsap.from($$(".w > span", el), {
      yPercent: 110, duration: 1.3, ease, stagger: 0.025,
      scrollTrigger: { trigger: el, start: "top 80%" },
    });
  });
  $$("[data-split-lines]").forEach((el) => {
    gsap.from($$(".line > span", el), {
      yPercent: 110, duration: 1.4, ease, stagger: 0.1,
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 88%", once: true,
    onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease, stagger: 0.1, overwrite: true }),
  });
  gsap.set("[data-reveal]", { opacity: 0 });

  $$("[data-count]").forEach((el) => {
    const end = +el.dataset.count, o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 2.2, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString("nl-BE")),
    });
  });

  $$("[data-parallax]").forEach((img) => {
    gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 0, ease: "none",
      scrollTrigger: { trigger: img.closest("section, figure"), start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  $$("[data-reveal-img]").forEach((fig) => {
    gsap.fromTo(fig, { clipPath: "inset(18% 0% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut",
      scrollTrigger: { trigger: fig, start: "top 85%" },
    });
  });

  /* ---------- advice: frame opens to full bleed ---------- */
  const clip = $("[data-clip]");
  if (clip) {
    gsap.fromTo(clip, { clipPath: "inset(9% 7% 9% 7% round 3px)" }, {
      clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none",
      scrollTrigger: { trigger: ".advice", start: "top 85%", end: "top 5%", scrub: true },
    });
  }

  /* ---------- generations: pinned horizontal (desktop) ---------- */
  const mm = gsap.matchMedia();
  mm.add("(min-width: 761px)", () => {
    const pin = $("[data-gens]"), track = $("[data-gens-track]");
    const bar = $("[data-gens-bar]"), idx = $("[data-gens-index]");
    const gens = $$(".gen:not(.gen--end)", track);
    const dist = () => track.scrollWidth - innerWidth;

    const move = gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: pin, start: "top top", end: () => "+=" + dist(),
        pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => {
          bar.style.transform = `scaleX(${self.progress})`;
          const i = Math.min(gens.length, Math.floor(self.progress * (gens.length + 0.6)) + 1);
          idx.textContent = String(i).padStart(2, "0");
        },
      },
    });

    $$(".gen", track).forEach((g) => {
      const code = $(".gen__code", g), img = $("[data-gen-img]", g);
      if (code) gsap.fromTo(code, { xPercent: 18 }, { xPercent: -18, ease: "none", scrollTrigger: { trigger: g, containerAnimation: move, start: "left right", end: "right left", scrub: true } });
      if (img) gsap.fromTo(img, { x: 120, opacity: 0.2 }, { x: -40, opacity: 1, ease: "none", scrollTrigger: { trigger: g, containerAnimation: move, start: "left right", end: "center center", scrub: true } });
    });
  });

  /* ---------- storeroom: image follows the cursor ---------- */
  const card = $("[data-cursor-card]"), list = $("[data-index]");
  if (card && list && matchMedia("(hover: hover) and (min-width: 761px)").matches) {
    const img = $("img", card);
    const xTo = gsap.quickTo(card, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(card, "y", { duration: 0.6, ease: "power3" });
    const rTo = gsap.quickTo(card, "rotation", { duration: 0.8, ease: "power3" });
    let px = 0;
    gsap.set(card, { xPercent: -50, yPercent: -50 });
    addEventListener("pointermove", (e) => {
      xTo(e.clientX + 40); yTo(e.clientY);
      rTo(gsap.utils.clamp(-6, 6, (e.clientX - px) * 0.4)); px = e.clientX;
    }, { passive: true });
    $$(".row", list).forEach((row) => row.addEventListener("pointerenter", () => {
      if (!img.src.endsWith(row.dataset.img)) img.src = row.dataset.img;
    }));
    list.addEventListener("pointerenter", () => gsap.to(card, { opacity: 1, scale: 1, duration: 0.5, ease }));
    list.addEventListener("pointerleave", () => gsap.to(card, { opacity: 0, scale: 0.85, duration: 0.4, ease: "power2.out" }));
  }

  /* ---------- footer wordmark ---------- */
  gsap.from("[data-mark] span", {
    yPercent: 100, duration: 1.6, ease, stagger: 0.07,
    scrollTrigger: { trigger: "[data-mark]", start: "top 95%" },
  });

  addEventListener("load", () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();
