/* Vehicle data: models and chassis that appear in the current catalogue.
   Brands without listed models fall back to their full brand page. */
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
  const brandSel = finder.querySelector("[data-brand]");
  const modelSel = finder.querySelector("[data-model]");
  const chassisSel = finder.querySelector("[data-chassis]");

  const fillChassis = () => {
    const m = VEHICLES[brandSel.value].models[modelSel.value];
    chassisSel.replaceChildren(option("", m ? "Alle generaties" : "Kies een model"));
    if (m) m.chassis.forEach(([k, label]) => chassisSel.append(option(k, label)));
    chassisSel.disabled = !m;
  };

  const fillModels = () => {
    const models = Object.entries(VEHICLES[brandSel.value].models);
    modelSel.replaceChildren(option("", "Alle modellen"));
    models.forEach(([k, m]) => modelSel.append(option(k, m.label)));
    modelSel.disabled = models.length === 0;
    fillChassis();
  };

  brandSel.addEventListener("change", fillModels);
  modelSel.addEventListener("change", fillChassis);

  finder.addEventListener("submit", (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (modelSel.value) params.set("model", modelSel.value);
    if (chassisSel.value) params.set("chassis", chassisSel.value);
    const qs = params.toString();
    window.location.href = `/merk/${brandSel.value}${qs ? `?${qs}` : ""}`;
  });

  fillModels();
}

/* "Zoek op OEM-nummer" focuses the header search (or opens /zoeken on small screens) */
document.querySelector("[data-focus-search]")?.addEventListener("click", (e) => {
  const input = document.getElementById("q-nav");
  if (input && input.offsetParent !== null) {
    e.preventDefault();
    input.focus();
  } else {
    e.preventDefault();
    window.location.href = "/zoeken";
  }
});

/* ---------- Mobile menu ---------- */
const menuBtn = document.querySelector("[data-menu-btn]");
const menu = document.getElementById("menu");
if (menuBtn && menu) {
  const openIcon = menuBtn.innerHTML;
  const closeIcon = '<svg class="i" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"/></svg>';
  const setOpen = (open) => {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Menu sluiten" : "Menu openen");
    menuBtn.innerHTML = open ? closeIcon : openIcon;
    menu.hidden = !open;
  };
  menuBtn.addEventListener("click", () => setOpen(menuBtn.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) { setOpen(false); menuBtn.focus(); }
  });
  matchMedia("(min-width: 1181px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
}

/* ---------- Add to cart (demo feedback) ---------- */
const addBtn = document.querySelector("[data-add-to-cart]");
const countEl = document.querySelector("[data-cart-count]");
const cartLink = document.querySelector("[data-cart-link]");
const statusEl = document.querySelector("[data-cart-status]");
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
      statusEl.textContent = "Voorbumper lip toegevoegd aan uw winkelwagen.";
      if (window.gsap && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(countEl, { scale: 0.6 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
      }
      setTimeout(() => {
        addBtn.classList.remove("is-added");
        addBtn.disabled = false;
        label.textContent = "In winkelwagen";
      }, 2000);
    }, 400);
  });
}

/* ---------- Motion ---------- */
window.addEventListener("DOMContentLoaded", () => {
  if (!window.gsap) return;

  // Hero: one short sequence. Title, then sub, then finder, then the photo as one composition.
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const [title, sub, form, media] = document.querySelectorAll("[data-hero]");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(title, { y: 18, opacity: 0, duration: 0.6 })
      .from(sub, { y: 14, opacity: 0, duration: 0.5 }, "-=0.4")
      .from(form, { y: 14, opacity: 0, duration: 0.5 }, "-=0.35")
      .from(media, { clipPath: "inset(0 0 0 100%)", duration: 0.9, ease: "power3.inOut" }, 0.1)
      .from(media.querySelector("img"), { scale: 1.08, duration: 1.4 }, 0.1);
  });

  // Section reveals: slower than UI motion on purpose, this is a once-per-visit scroll story.
  if (window.TastemakerMotion) {
    TastemakerMotion.init({ duration: 0.6, distance: 16, ease: "power3.out", staggerStep: 0.07 });
  }
});
