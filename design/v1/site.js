document.documentElement.classList.add("js");

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

function option(value, text) {
  const o = document.createElement("option");
  o.value = value;
  o.textContent = text;
  return o;
}

/* ---------- Finder ---------- */
const vehicleForm = document.querySelector("[data-vehicle-form]");
if (vehicleForm) {
  const modelSel = vehicleForm.querySelector("[data-model]");
  const chassisSel = vehicleForm.querySelector("[data-chassis]");
  const hint = vehicleForm.querySelector("[data-hint]");

  const brand = () => vehicleForm.querySelector('input[name="merk"]:checked').value;

  function fillModels() {
    const b = VEHICLES[brand()];
    const models = Object.entries(b.models);
    modelSel.replaceChildren(option("", "Alle modellen"));
    models.forEach(([k, m]) => modelSel.append(option(k, m.label)));
    modelSel.disabled = models.length === 0;
    hint.innerHTML = models.length
      ? ""
      : `Bekijk het volledige ${b.label}-assortiment of <a href="https://wa.me/32470180772">vraag ons naar uw model</a>.`;
    fillChassis();
  }

  function fillChassis() {
    const m = VEHICLES[brand()].models[modelSel.value];
    chassisSel.replaceChildren(option("", m ? "Alle generaties" : "Kies een model"));
    if (m) m.chassis.forEach(([k, label]) => chassisSel.append(option(k, label)));
    chassisSel.disabled = !m;
  }

  vehicleForm.addEventListener("change", (e) => {
    if (e.target.name === "merk") fillModels();
    if (e.target === modelSel) fillChassis();
  });

  vehicleForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const b = brand();
    const params = new URLSearchParams();
    if (modelSel.value) params.set("model", modelSel.value);
    if (chassisSel.value) params.set("chassis", chassisSel.value);
    const qs = params.toString();
    window.location.href = `/merk/${b}${qs ? `?${qs}` : ""}`;
  });

  fillModels();
}

/* OEM search: inline validation */
const oemForm = document.querySelector("[data-oem-form]");
if (oemForm) {
  const input = oemForm.querySelector("input");
  const err = oemForm.querySelector(".field__error");
  oemForm.addEventListener("submit", (e) => {
    if (!input.value.trim()) {
      e.preventDefault();
      err.hidden = false;
      input.setAttribute("aria-invalid", "true");
      input.focus();
    }
  });
  input.addEventListener("input", () => {
    if (input.value.trim()) {
      err.hidden = true;
      input.removeAttribute("aria-invalid");
    }
  });
}

/* Tabs (ARIA tabs pattern with arrow keys) */
const tabs = [...document.querySelectorAll(".finder__tab")];
function selectTab(tab, focus) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      selectTab(next, true);
    }
  });
});

/* ---------- Mobile nav ---------- */
const menuBtn = document.querySelector(".menu-btn");
const mobileNav = document.getElementById("mobile-nav");
if (menuBtn && mobileNav) {
  const icon = menuBtn.querySelector("i");
  const setOpen = (open) => {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Menu sluiten" : "Menu openen");
    icon.className = `ph-bold ${open ? "ph-x" : "ph-list"}`;
    mobileNav.hidden = !open;
  };
  menuBtn.addEventListener("click", () => setOpen(menuBtn.getAttribute("aria-expanded") !== "true"));
  mobileNav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mobileNav.hidden) { setOpen(false); menuBtn.focus(); }
  });
  matchMedia("(min-width: 1024px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
}

/* ---------- Add to cart (demo feedback) ---------- */
const addBtn = document.querySelector("[data-add-to-cart]");
const countEl = document.querySelector("[data-cart-count]");
const statusEl = document.querySelector("[data-cart-status]");
if (addBtn && countEl) {
  let count = 0;
  addBtn.addEventListener("click", () => {
    const label = addBtn.querySelector("[data-label]");
    addBtn.disabled = true;
    label.textContent = "Toevoegen...";
    setTimeout(() => {
      count += 1;
      countEl.textContent = count;
      countEl.closest("a").setAttribute("aria-label", `Winkelwagen, ${count} ${count === 1 ? "artikel" : "artikelen"}`);
      countEl.classList.remove("bump");
      void countEl.offsetWidth;
      countEl.classList.add("bump");
      addBtn.classList.add("is-added");
      label.textContent = "Toegevoegd";
      statusEl.textContent = "Voorbumper lip toegevoegd aan uw winkelwagen.";
      setTimeout(() => {
        addBtn.classList.remove("is-added");
        addBtn.disabled = false;
        label.textContent = "In winkelwagen";
      }, 2200);
    }, 450);
  });
}
