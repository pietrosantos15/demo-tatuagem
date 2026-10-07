/* Personalização por link: ?wa=5515999998888&nome=Nome%20do%20Estudio */
const params = new URLSearchParams(location.search);
const WA = (params.get("wa") || "5500900000000").replace(/\D/g, "");
const NOME = params.get("nome");
const waUrl = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const fmtPhone = n => {
  const d = n.replace(/^55/, "");
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
       : d.length === 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : n;
};

if (NOME) {
  document.querySelectorAll("[data-brand]").forEach(el => (el.textContent = NOME));
  document.title = NOME + " | Estúdio de tatuagem em Sorocaba";
}
document.querySelectorAll("a[data-wa]").forEach(a => (a.href = waUrl(a.dataset.wa)));
if (params.get("wa")) document.querySelectorAll("[data-phone]").forEach(el => (el.textContent = fmtPhone(WA)));

/* Navegação: destaca a seção visível */
const nav = document.getElementById("nav");
const links = [...nav.querySelectorAll("a:not(.btn)")];
const obs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    links.forEach(a => a.removeAttribute("aria-current"));
    const l = links.find(a => a.getAttribute("href") === "#" + en.target.id);
    if (l) l.setAttribute("aria-current", "true");
  });
}, { rootMargin: "-20% 0px -65% 0px" });
document.querySelectorAll("main section[id]").forEach(s => obs.observe(s));

/* Menu em telas pequenas */
const mbtn = document.getElementById("menu-btn");
const setMenu = open => {
  nav.classList.toggle("open", open);
  mbtn.setAttribute("aria-expanded", open);
  mbtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
};
mbtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

/* Formulário: monta a mensagem e abre o WhatsApp */
const form = document.getElementById("form");
form.addEventListener("submit", e => {
  e.preventDefault();
  const v = n => form.elements[n].value.trim();
  const err = document.getElementById("f-err");
  if (!v("nome") || !v("local")) { err.hidden = false; (v("nome") ? form.elements.local : form.elements.nome).focus(); return; }
  err.hidden = true;
  const msg = [
    `Olá! Meu nome é ${v("nome")} e quero agendar um orçamento de tatuagem.`,
    `Estilo: ${v("estilo")}`,
    `Local do corpo: ${v("local")}`,
    `Tamanho: ${v("tam")}`,
    v("ideia") ? `Ideia: ${v("ideia")}` : ""
  ].filter(Boolean).join("\n");
  window.open(waUrl(msg), "_blank", "noopener");
});

/* Atalho dos estilos: pré-seleciona o estilo no formulário */
document.querySelectorAll("[data-style]").forEach(a => a.addEventListener("click", () => {
  form.elements.estilo.value = a.dataset.style;
}));

/* Fotos que não carregam: remove a figura e a grade se reorganiza sem buracos */
const dropBroken = img => {
  const fig = img.closest("figure");
  if (!fig) return;
  const col = fig.parentElement;
  fig.remove();
  if (col && col.classList.contains("m-col") && !col.children.length) col.remove();
};
document.querySelectorAll("img").forEach(img => {
  img.addEventListener("error", () => dropBroken(img));
  if (img.complete && img.naturalWidth === 0 && img.currentSrc) dropBroken(img);
});
