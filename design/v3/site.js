const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Vehicle data (models and chassis present in the catalogue) ---------- */
const VEHICLES = {
  bmw: {
    label: "BMW",
    models: {
      "1-serie": { label: "1 Serie", chassis: [["f20", "F20 / F21 (2011-2019)"]] },
      "3-serie": {
        label: "3 Serie",
        chassis: [
          ["e30", "E30 (1982-1994)"],
          ["e36", "E36 (1990-2000)"],
          ["e46", "E46 (1998-2006)"],
          ["f30", "F30 / F31 (2012-2019)"],
        ],
      },
    },
  },
  mini: { label: "MINI", models: {} },
  porsche: { label: "Porsche", models: {} },
  volkswagen: { label: "Volkswagen", models: {} },
  mercedes: { label: "Mercedes", models: {} },
};

const option = (value, text) => {
  const o = document.createElement("option");
  o.value = value;
  o.textContent = text;
  return o;
};

/* ---------- Finder ---------- */
const finder = document.querySelector("[data-finder]");
if (finder) {
  const modelSel = finder.querySelector("[data-model]");
  const chassisSel = finder.querySelector("[data-chassis]");
  const hint = finder.querySelector("[data-hint]");
  const query = finder.querySelector("#f-q");
  const brand = () => finder.querySelector('input[name="merk"]:checked').value;

  const fillChassis = () => {
    const m = VEHICLES[brand()].models[modelSel.value];
    chassisSel.replaceChildren(option("", m ? "Alle generaties" : "Kies een model"));
    if (m) m.chassis.forEach(([k, label]) => chassisSel.append(option(k, label)));
    chassisSel.disabled = !m;
  };
  const fillModels = () => {
    const b = VEHICLES[brand()];
    const models = Object.entries(b.models);
    modelSel.replaceChildren(option("", "Alle modellen"));
    models.forEach(([k, m]) => modelSel.append(option(k, m.label)));
    modelSel.disabled = models.length === 0;
    hint.innerHTML = models.length ? "" : `Het volledige ${b.label}-assortiment staat klaar. Zoekt u iets specifieks? <a href="https://wa.me/32470180772">Vraag het ons via WhatsApp</a>.`;
    fillChassis();
  };

  finder.addEventListener("change", (e) => {
    if (e.target.name === "merk") fillModels();
    if (e.target === modelSel) fillChassis();
  });
  finder.addEventListener("submit", (e) => {
    e.preventDefault();
    if (query.value.trim()) {
      window.location.href = `/zoeken?q=${encodeURIComponent(query.value.trim())}`;
      return;
    }
    const params = new URLSearchParams();
    if (modelSel.value) params.set("model", modelSel.value);
    if (chassisSel.value) params.set("chassis", chassisSel.value);
    const qs = params.toString();
    window.location.href = `/merk/${brand()}${qs ? `?${qs}` : ""}`;
  });
  fillModels();
}

/* ---------- Live opening status (Europe/Brussels) ---------- */
const status = document.querySelector("[data-status]");
if (status) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Brussels", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date()).map((p) => [p.type, p.value])
  );
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
  const mins = Number(parts.hour) * 60 + Number(parts.minute);
  const opens = day === 0 ? null : day === 6 ? 9 * 60 : 8 * 60;
  const isOpen = opens !== null && mins >= opens && mins < 17 * 60;
  let text;
  if (isOpen) text = "Nu open in Gent, tot 17:00";
  else if (opens !== null && mins < opens) text = `Gesloten, vandaag open vanaf ${day === 6 ? "09:00" : "08:00"}`;
  else text = day === 5 ? "Gesloten, morgen open vanaf 09:00" : day === 6 || day === 0 ? "Gesloten, maandag open vanaf 08:00" : "Gesloten, morgen open vanaf 08:00";
  status.classList.toggle("is-open", isOpen);
  status.querySelector("[data-status-text]").textContent = text;
}

/* ---------- Menu ---------- */
const burger = document.querySelector("[data-burger]");
const menu = document.querySelector("[data-menu]");
let lenis;
if (burger && menu) {
  const links = menu.querySelectorAll(".menu__nav a span, .menu__side > *");
  const setOpen = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.querySelector(".burger__label").textContent = open ? "Sluit" : "Menu";
    if (open) {
      menu.hidden = false;
      lenis?.stop();
      if (window.gsap && !reduceMotion) {
        gsap.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
        gsap.fromTo(links, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.05, delay: 0.1 });
      }
    } else {
      lenis?.start();
      if (window.gsap && !reduceMotion) gsap.to(menu, { opacity: 0, duration: 0.35, ease: "power2.in", onComplete: () => (menu.hidden = true) });
      else menu.hidden = true;
    }
  };
  burger.addEventListener("click", () => setOpen(burger.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { setOpen(false); burger.focus(); } });
}

/* ---------- Category accordion ---------- */
const slices = [...document.querySelectorAll(".slice")];
const openSlice = (s) => slices.forEach((x) => x.classList.toggle("is-open", x === s));
slices.forEach((s) => {
  s.addEventListener("mouseenter", () => openSlice(s));
  s.addEventListener("focusin", () => openSlice(s));
  s.addEventListener("click", () => openSlice(s));
});

/* ---------- Add to cart (demo) ---------- */
const addBtn = document.querySelector("[data-add-to-cart]");
const countEl = document.querySelector("[data-cart-count]");
const cartLink = document.querySelector("[data-cart-link]");
const cartStatus = document.querySelector("[data-cart-status]");
if (addBtn && countEl) {
  let count = 0;
  addBtn.addEventListener("click", () => {
    const label = addBtn.querySelector("[data-label]");
    addBtn.disabled = true;
    label.textContent = "Toevoegen…";
    setTimeout(() => {
      count += 1;
      countEl.textContent = count;
      countEl.hidden = false;
      cartLink.setAttribute("aria-label", `Winkelwagen, ${count} ${count === 1 ? "artikel" : "artikelen"}`);
      addBtn.classList.add("is-added");
      label.textContent = "Toegevoegd";
      cartStatus.textContent = "Voorbumper lip toegevoegd aan uw winkelwagen.";
      if (window.gsap && !reduceMotion) gsap.fromTo(countEl, { scale: 0.4 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      setTimeout(() => { addBtn.classList.remove("is-added"); addBtn.disabled = false; label.textContent = "In winkelwagen"; }, 2000);
    }, 400);
  });
}

/* ---------- Motion ---------- */
window.addEventListener("DOMContentLoaded", () => {
  const slides = [...document.querySelectorAll(".hero__slide")];
  const bars = [...document.querySelectorAll(".hero__progress li")];

  if (!window.gsap || reduceMotion) {
    document.querySelectorAll(".ship__text").forEach((el) => (el.style.opacity = 1));
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Smooth scroll, synced with ScrollTrigger
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) =>
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -24 }); }
      })
    );
  }

  // Hero intro: label, masked lines, sub, CTAs
  gsap.timeline({ defaults: { ease: "expo.out" } })
    .from("[data-hero-line]", { yPercent: 115, duration: 1.4, stagger: 0.1 }, 0.15)
    .from("[data-hero-in]", { y: 24, opacity: 0, filter: "blur(8px)", duration: 1.2, stagger: 0.08 }, 0.45)
    .from(".island", { y: -30, opacity: 0, duration: 1.1 }, 0.3);

  // Hero slideshow: crossfade with slow push-in, progress bars
  if (slides.length > 1) {
    let i = 0;
    const DURATION = 6;
    const play = () => {
      slides.forEach((s, k) => s.classList.toggle("is-active", k === i));
      gsap.fromTo(slides[i].querySelector("img"), { scale: 1.12 }, { scale: 1, duration: DURATION + 1.6, ease: "none" });
      bars.forEach((b, k) => b.style.setProperty("--p", k < i ? 1 : 0));
      gsap.fromTo(bars[i], { "--p": 0 }, {
        "--p": 1, duration: DURATION, ease: "none",
        onComplete: () => { i = (i + 1) % slides.length; play(); },
      });
    };
    play();
  }
  // Hero content drifts up and fades as you leave
  gsap.to(".hero__center", { yPercent: -18, opacity: 0, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  // Reveals: heavy fade-up with blur
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.from(el, { y: 56, opacity: 0, filter: "blur(10px)", duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  gsap.utils.toArray("[data-reveal-group]").forEach((el) => {
    gsap.from(el.children, { y: 36, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
  });

  // Deal cards scale in as they arrive, then dim slightly as they leave
  gsap.utils.toArray("[data-scale-in]").forEach((el) => {
    gsap.fromTo(el, { scale: 0.86, opacity: 0.4 }, { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 100%", end: "top 55%", scrub: true } });
  });

  // Delivery text: words scrub from faint to full
  const scrub = document.querySelector("[data-scrub]");
  if (scrub) {
    scrub.innerHTML = scrub.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
    gsap.to(scrub.querySelectorAll(".w"), {
      opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: scrub, start: "top 80%", end: "bottom 45%", scrub: true },
    });
  }

  // Parallax inside the advice image
  gsap.utils.toArray("[data-parallax] img").forEach((img) => {
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
  });

  // Island darkens once past the hero
  ScrollTrigger.create({
    trigger: ".hero", start: "bottom top+=80",
    onEnter: () => gsap.to(".island", { backgroundColor: "rgba(18,18,17,0.82)", duration: 0.6 }),
    onLeaveBack: () => gsap.to(".island", { backgroundColor: "rgba(18,18,17,0.55)", duration: 0.6 }),
  });
});
