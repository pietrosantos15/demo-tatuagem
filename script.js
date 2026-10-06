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

/* Botões de estilo: pré-selecionam o estilo no formulário */
const form = document.getElementById("form"), err = document.getElementById("err");
document.querySelectorAll("[data-estilo]").forEach(b => b.addEventListener("click", () => {
  form.estilo.value = b.dataset.estilo;
  document.getElementById("contato").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => form.nome.focus({ preventScroll: true }), 400);
}));

/* Formulário: monta a mensagem e abre o WhatsApp */
form.addEventListener("submit", e => {
  e.preventDefault();
  const nome = form.nome.value.trim();
  err.hidden = !!nome;
  if (!nome) { form.nome.focus(); return; }
  const partes = [`Olá! Meu nome é ${nome} e quero agendar um orçamento de tatuagem.`, `Estilo: ${form.estilo.value}.`];
  if (form.local.value.trim()) partes.push(`Local do corpo: ${form.local.value.trim()}.`);
  if (form.tamanho.value.trim()) partes.push(`Tamanho aproximado: ${form.tamanho.value.trim()}.`);
  if (form.ideia.value.trim()) partes.push(`Ideia: ${form.ideia.value.trim()}`);
  window.open(waUrl(partes.join(" ")), "_blank", "noopener");
});
