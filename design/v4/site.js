const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Fitment data (models and chassis present in the catalogue) ---------- */
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
  mini: { label: "MINI" },
  porsche: { label: "Porsche" },
  volkswagen: { label: "Volkswagen" },
  mercedes: { label: "Mercedes" },
};

const option = (value, text) => Object.assign(document.createElement("option"), { value, textContent: text });

/* ---------- Finder: tabs ---------- */
const tabs = [...document.querySelectorAll('.finder__tabs [role="tab"]')];
const selectTab = (tab, focus) => {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
  if (focus) tab.focus();
};
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    selectTab(tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length], true);
  });
});

/* ---------- Finder: by car ---------- */
const auto = document.querySelector("[data-auto]");
if (auto) {
  const modelSel = auto.querySelector("[data-model]");
  const chassisSel = auto.querySelector("[data-chassis]");
  const fields = auto.querySelector("[data-fields]");
  const note = auto.querySelector("[data-note]");
  const submitLabel = auto.querySelector("[data-submit-label]");
  const make = () => auto.querySelector('input[name="merk"]:checked').value;

  const fillChassis = () => {
    const m = VEHICLES.bmw.models[modelSel.value];
    chassisSel.replaceChildren(option("", m ? "Alle generaties" : "Eerst een model"));
    if (m) m.chassis.forEach(([k, label]) => chassisSel.append(option(k, label)));
    chassisSel.disabled = !m;
  };
  const update = () => {
    const v = VEHICLES[make()];
    const hasModels = Boolean(v.models);
    fields.hidden = !hasModels;
    note.hidden = hasModels;
    submitLabel.textContent = hasModels ? "Toon onderdelen" : `Toon ${v.label}-onderdelen`;
    if (hasModels) {
      modelSel.replaceChildren(option("", "Alle modellen"));
      Object.entries(v.models).forEach(([k, m]) => modelSel.append(option(k, m.label)));
      fillChassis();
    } else {
      note.innerHTML = `U ziet het volledige ${v.label}-assortiment. Twijfelt u over de pasvorm? <a href="https://wa.me/32470180772">Vraag het via WhatsApp</a>.`;
    }
  };
  auto.addEventListener("change", (e) => {
    if (e.target.name === "merk") update();
    if (e.target === modelSel) fillChassis();
  });
  auto.addEventListener("submit", (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (make() === "bmw") {
      if (modelSel.value) params.set("model", modelSel.value);
      if (chassisSel.value) params.set("chassis", chassisSel.value);
    }
    const qs = params.toString();
    window.location.href = `/merk/${make()}${qs ? `?${qs}` : ""}`;
  });
  update();
}

/* ---------- Finder: by number ---------- */
const nr = document.querySelector("[data-nr]");
if (nr) {
  const input = nr.querySelector("input");
  const err = nr.querySelector(".field__err");
  nr.addEventListener("submit", (e) => {
    if (input.value.trim()) return;
    e.preventDefault();
    err.hidden = false;
    input.setAttribute("aria-invalid", "true");
    input.focus();
  });
  input.addEventListener("input", () => { err.hidden = true; input.removeAttribute("aria-invalid"); });
}

/* ---------- Opening status (Europe/Brussels) ---------- */
const status = document.querySelector("[data-status]");
if (status) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Brussels", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date()).map((x) => [x.type, x.value])
  );
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
  const mins = Number(p.hour) * 60 + Number(p.minute);
  const opens = day === 0 ? null : day === 6 ? 540 : 480;
  const open = opens !== null && mins >= opens && mins < 1020;
  let text;
  if (open) text = "Toonbank open tot 17:00";
  else if (opens !== null && mins < opens) text = `Gesloten, open om ${day === 6 ? "09:00" : "08:00"}`;
  else text = day === 5 ? "Gesloten, morgen open om 09:00" : day >= 6 || day === 0 ? "Gesloten, maandag open om 08:00" : "Gesloten, morgen open om 08:00";
  status.classList.toggle("is-open", open);
  status.querySelector("[data-status-text]").textContent = `${text}. Kleimoer 1B, Gent`;
}

/* ---------- Menu ---------- */
const menuBtn = document.querySelector("[data-menu-btn]");
const drawer = document.getElementById("menu");
if (menuBtn && drawer) {
  const openIcon = menuBtn.innerHTML;
  const closeIcon = '<svg class="i" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/></svg>';
  const setOpen = (open) => {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Menu sluiten" : "Menu openen");
    menuBtn.innerHTML = open ? closeIcon : openIcon;
    drawer.hidden = !open;
  };
  menuBtn.addEventListener("click", () => setOpen(menuBtn.getAttribute("aria-expanded") !== "true"));
  drawer.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !drawer.hidden) { setOpen(false); menuBtn.focus(); } });
  matchMedia("(min-width: 1101px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
}

/* ---------- Motion: one entrance, plain reveals ---------- */
window.addEventListener("DOMContentLoaded", () => {
  if (!window.gsap || reduceMotion) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.timeline({ defaults: { ease: "expo.out" } })
    .from(".hero__title .ln > span", { yPercent: 110, duration: 1.2, stagger: 0.09 }, 0.2)
    .from([".hero__sub", ".finder", ".status"], { y: 20, opacity: 0, duration: 1, stagger: 0.08 }, 0.5);

  gsap.utils.toArray("[data-reveal]").forEach((el) =>
    gsap.from(el, { y: 32, opacity: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } })
  );
  gsap.utils.toArray("[data-reveal-group]").forEach((el) =>
    gsap.from(el.children, { y: 24, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: el, start: "top 88%", once: true } })
  );
});
