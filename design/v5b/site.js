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

  /* ---------- live opening status (Mon-Fri 08-17, Sat 09-17) ---------- */
  const HOURS = { 1: [8, 17], 2: [8, 17], 3: [8, 17], 4: [8, 17], 5: [8, 17], 6: [9, 17] };
  const DAYS = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
  const status = () => {
    const now = new Date(), d = now.getDay(), h = now.getHours() + now.getMinutes() / 60, today = HOURS[d];
    if (today && h >= today[0] && h < today[1]) return { open: true, text: `Toonbank nu open, tot ${today[1]}:00` };
    let n = d, add = 0;
    do { n = (n + 1) % 7; add++; } while (!HOURS[n]);
    if (today && h < today[0]) return { open: false, text: `Gesloten, vandaag open om ${String(today[0]).padStart(2, "0")}:00` };
    const day = add === 1 ? "morgen" : DAYS[n];
    return { open: false, text: `Gesloten, ${day} open om ${String(HOURS[n][0]).padStart(2, "0")}:00` };
  };
  const st = status();
  $$("[data-status-text]").forEach((el) => (el.textContent = st.text));
  $$("[data-status], .hero__loc").forEach((el) => el.classList.toggle("is-closed", !st.open));
  $$("[data-hours] [data-days]").forEach((row) => row.classList.toggle("is-today", row.dataset.days.split(",").includes(String(new Date().getDay()))));

  /* ---------- anatomy: spots <-> legend ---------- */
  const legend = $(".legend");
  const setSpot = (n) => {
    $$(".spot").forEach((s) => s.classList.toggle("is-active", s.dataset.spot === n));
    $$(".legend__item").forEach((li) => li.classList.toggle("is-active", li.dataset.spot === n));
    legend?.classList.toggle("has-active", !!n);
  };
  $$(".spot, .legend__item").forEach((el) => {
    el.addEventListener("pointerenter", () => setSpot(el.dataset.spot));
    el.addEventListener("focusin", () => setSpot(el.dataset.spot));
    el.addEventListener("click", () => setSpot(el.dataset.spot));
  });
  $(".anat__stage")?.addEventListener("pointerleave", () => setSpot(null));

  /* ---------- storeroom: chassis filter + spec viewer ---------- */
  const index = $("[data-index]");
  if (index) {
    const rows = $$(".row", index), vImg = $("[data-v-img]"), vCode = $("[data-v-code]"), vSku = $("[data-v-sku]");
    const show = (row) => {
      rows.forEach((r) => r.classList.toggle("is-active", r === row));
      index.classList.add("has-active");
      if (vImg.getAttribute("src") === row.dataset.img) return;
      const swap = () => { vImg.src = row.dataset.img; vCode.innerHTML = row.dataset.code; vSku.textContent = row.dataset.sku; };
      if (hasGsap && !reduce) gsap.timeline().to(vImg, { opacity: 0, y: 10, duration: 0.18, ease: "power2.in", onComplete: swap }).to(vImg, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" });
      else swap();
    };
    rows.forEach((r) => { r.addEventListener("pointerenter", () => show(r)); r.addEventListener("focusin", () => show(r)); });
    index.addEventListener("pointerleave", () => { index.classList.remove("has-active"); rows.forEach((r) => r.classList.remove("is-active")); });

    const chips = $$("[data-chips] button"), out = $("[data-count-out]");
    chips.forEach((c) => c.addEventListener("click", () => {
      chips.forEach((x) => x.setAttribute("aria-pressed", String(x === c)));
      const f = c.dataset.filter, vis = rows.filter((r) => f === "all" || r.dataset.chassis === f);
      rows.forEach((r) => (r.hidden = !vis.includes(r)));
      out.textContent = vis.length;
      if (vis[0]) show(vis[0]);
      index.classList.remove("has-active"); rows.forEach((r) => r.classList.remove("is-active"));
      if (hasGsap && !reduce) gsap.fromTo(vis, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "expo.out" });
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    }));
  }

  const nav = $("[data-nav]");
  if (!hasGsap || reduce) {
    document.documentElement.classList.remove("js");
    $("[data-chat]")?.classList.add("no-anim");
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

  /* ---------- anatomy: spots arrive, then walk through once ---------- */
  ScrollTrigger.create({
    trigger: ".anat__stage", start: "top 70%", once: true,
    onEnter: () => {
      gsap.from(".spot", { scale: 0, duration: 0.8, ease: "back.out(2)", stagger: 0.12 });
      gsap.from(".legend__item", { opacity: 0, y: 20, duration: 1, ease, stagger: 0.1 });
      ["1", "2", "3"].forEach((n, i) => gsap.delayedCall(1.2 + i * 1.1, () => setSpot(n)));
      gsap.delayedCall(4.6, () => setSpot(null));
    },
  });
  gsap.from(".anat__car img", { x: 80, opacity: 0, duration: 1.8, ease, scrollTrigger: { trigger: ".anat__stage", start: "top 80%" } });

  /* ---------- chat plays out when it scrolls in ---------- */
  const chat = $("[data-chat]");
  if (chat) {
    const msgs = $$(".msg", chat), typing = $(".msg--typing", chat);
    gsap.set(msgs, { opacity: 0, y: 16, scale: 0.98, transformOrigin: "bottom center" });
    const pop = (el) => gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.6)" });
    const tl = gsap.timeline({ paused: true });
    msgs.forEach((m) => {
      if (m === typing) { tl.add(() => pop(typing)).to({}, { duration: 1.3 }).add(() => gsap.to(typing, { opacity: 0, height: 0, padding: 0, margin: 0, duration: 0.25 })); }
      else tl.add(() => pop(m)).to({}, { duration: m.classList.contains("msg--in") ? 1.1 : 0.7 });
    });
    ScrollTrigger.create({ trigger: chat, start: "top 70%", once: true, onEnter: () => tl.play() });
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

  addEventListener("load", () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();
