// =============================================================
//  cms.js — Luxstore × Sanity  |  Vanilla JS, sin dependencias
// =============================================================
//
//  Pasos para activar:
//  1. Creá el proyecto en https://sanity.io
//  2. Reemplazá SANITY_PROJECT_ID con el ID que te dan
//  3. En Sanity Studio, completá el contenido de cada sección
//  4. Asegurate de que el dataset sea "public" en sanity.io/manage
//
// =============================================================

const SANITY_PROJECT_ID = 'syny9o6g'   // ← reemplazar
const SANITY_DATASET    = 'production'
const SANITY_API_VER    = '2024-01-01'

// ── GROQ: trae todo el contenido en un solo request ──────────
const QUERY = `{
  "site": *[_type == "siteSettings" && _id == "siteSettings"][0]{
    brandName, footerTagline, footerCopyright
  },
  "hero": *[_type == "hero" && _id == "hero"][0]{
    headline, subheadline, ctaPrimary, ctaSecondary,
    "backgroundImage": backgroundImage.asset->url
  },
  "iphone": *[_type == "iphoneSection" && _id == "iphoneSection"][0]{
    sectionLabel, sectionTitle,
    "featured": featuredProduct->{
      name, tagline, features, ctaLabel,
      "image": image.asset->url
    },
    "sideProducts": sideProducts[]->{
      name, tagline, startingPrice
    },
    priceTable[]{ model, storage, startingPrice }
  },
  "bento": *[_type == "bentoSection" && _id == "bentoSection"][0]{
    ipadPro{ name, tagline, badge, "image": image.asset->url },
    macbook{ name, tagline, chips, "image": image.asset->url },
    imac{ name, tagline },
    macStudio{ name, tagline }
  },
  "accessories": *[_type == "accessoriesSection" && _id == "accessoriesSection"][0]{
    sectionLabel, sectionTitle,
    "products": products[]->{
      name, tagline, startingPrice, "image": image.asset->url
    }
  },
  "ecosystem": *[_type == "ecosystemSection" && _id == "ecosystemSection"][0]{
    sectionLabel, sectionTitle,
    items[]{ icon, name, description }
  },
  "payment": *[_type == "paymentSection" && _id == "paymentSection"][0]{
    title, description,
    methods[]{ label, highlighted },
    shippingTitle, shippingDescription, warrantyText
  }
}`

// ── Fetch desde Sanity CDN ────────────────────────────────────
async function fetchCMS() {
  const endpoint = `https://${SANITY_PROJECT_ID}.apicdn.sanity.io`
                 + `/v${SANITY_API_VER}/data/query/${SANITY_DATASET}`
                 + `?query=${encodeURIComponent(QUERY)}`

  const res = await fetch(endpoint)
  if (!res.ok) throw new Error(`Sanity HTTP ${res.status}`)
  const { result } = await res.json()
  return result
}

// ── Helpers DOM ───────────────────────────────────────────────

/** Reemplaza el texto de todos los elementos con data-cms="key" */
function setText(key, value) {
  if (value == null) return
  document.querySelectorAll(`[data-cms="${key}"]`)
    .forEach(el => { el.textContent = value })
}

/** Reemplaza el src de imágenes con data-cms-src="key" */
function setImage(key, url) {
  if (!url) return
  document.querySelectorAll(`[data-cms-src="${key}"]`)
    .forEach(el => { el.src = url })
}

// ── Renders de listas ─────────────────────────────────────────

function renderFeatures(features) {
  const el = document.querySelector('[data-cms-list="iphone.featured.features"]')
  if (!el || !features?.length) return
  el.innerHTML = features.map(f => `
    <li class="flex items-center gap-2">
      <span class="material-symbols-outlined text-primary text-sm">check_circle</span> ${f}
    </li>`).join('')
}

function renderSideProducts(products) {
  const el = document.querySelector('[data-cms-list="iphone.sideProducts"]')
  if (!el || !products?.length) return
  el.innerHTML = products.map(p => `
    <div class="bg-surface-container-low p-8 rounded-xl flex justify-between items-center cursor-default transition-colors">
      <div>
        <h4 class="font-bold">${p.name}</h4>
        <p class="text-sm text-on-surface-variant">
          ${p.tagline ?? ''}${p.startingPrice ? `. Desde USD ${p.startingPrice.toLocaleString('es-AR')}` : ''}
        </p>
      </div>
    </div>`).join('')
}

function renderPriceTable(rows) {
  const el = document.querySelector('[data-cms-list="iphone.priceTable"]')
  if (!el || !rows?.length) return
  el.innerHTML = rows.map(r => `
    <tr class="hover:bg-surface-container-low transition-colors">
      <td class="py-6 font-bold">${r.model}</td>
      <td class="py-6">${r.storage ?? ''}</td>
      <td class="py-6">USD ${r.startingPrice?.toLocaleString('es-AR') ?? ''}</td>
      <td class="py-6 text-right">
        <button class="bg-on-surface text-background px-4 py-1.5 rounded-full text-xs font-bold">Configurar</button>
      </td>
    </tr>`).join('')
}

function renderMacbookChips(chips) {
  const el = document.querySelector('[data-cms-list="bento.macbook.chips"]')
  if (!el || !chips?.length) return
  el.innerHTML = chips.map(c => `
    <span class="bg-surface-variant/50 px-3 py-1 rounded text-xs">${c}</span>`).join('')
}

function renderAccessories(products) {
  const el = document.querySelector('[data-cms-list="accessories.products"]')
  if (!el || !products?.length) return
  el.innerHTML = products.map(p => `
    <div class="bg-surface-container rounded-xl p-1 w-full group">
      <div class="bg-surface-dim rounded-[calc(0.75rem-1px)] p-8 h-full">
        <div class="h-64 flex items-center justify-center mb-8">
          <img alt="${p.name}"
               src="${p.image ?? ''}"
               class="h-full object-contain group-hover:scale-105 transition-transform duration-500"/>
        </div>
        <h3 class="text-2xl font-bold">${p.name}</h3>
        <p class="text-on-surface-variant mt-2 mb-6">${p.tagline ?? ''}</p>
        <span class="text-xl font-mono">USD ${p.startingPrice?.toLocaleString('es-AR') ?? ''}</span>
      </div>
    </div>`).join('')
}

function renderEcosystemItems(items) {
  const el = document.querySelector('[data-cms-list="ecosystem.items"]')
  if (!el || !items?.length) return
  el.innerHTML = items.map(item => `
    <div class="flex items-start gap-4">
      <div class="bg-surface-container-high p-3 rounded-lg">
        <span class="material-symbols-outlined text-primary">${item.icon ?? 'star'}</span>
      </div>
      <div>
        <h4 class="font-bold text-xl">${item.name}</h4>
        <p class="text-on-surface-variant">${item.description ?? ''}</p>
      </div>
    </div>`).join('')
}

function renderPaymentMethods(methods) {
  const el = document.querySelector('[data-cms-list="payment.methods"]')
  if (!el || !methods?.length) return
  el.innerHTML = methods.map(m => `
    <span class="px-6 py-3 rounded-full font-mono text-sm ${
      m.highlighted
        ? 'bg-primary-container text-on-primary-container'
        : 'bg-surface-container border border-outline-variant/20'
    }">${m.label}</span>`).join('')
}

// ── Main ──────────────────────────────────────────────────────
async function init() {
  // Si el Project ID no fue configurado, no hacemos nada
  if (SANITY_PROJECT_ID === 'TU_PROJECT_ID') {
    console.info('[CMS] Project ID no configurado. Mostrando contenido por defecto.')
    return
  }

  let data
  try {
    data = await fetchCMS()
  } catch (err) {
    // Fallback silencioso: el HTML estático queda visible
    console.warn('[CMS] No se pudo cargar el contenido:', err.message)
    return
  }

  const { site, hero, iphone, bento, accessories, ecosystem, payment } = data

  // ─ Site
  setText('site.brandName',      site?.brandName)
  setText('site.footerTagline',  site?.footerTagline)
  setText('site.footerCopyright',site?.footerCopyright)

  // ─ Hero
  setText ('hero.headline',         hero?.headline)
  setText ('hero.subheadline',      hero?.subheadline)
  setText ('hero.ctaPrimary',       hero?.ctaPrimary)
  setText ('hero.ctaSecondary',     hero?.ctaSecondary)
  setImage('hero.backgroundImage',  hero?.backgroundImage)

  // ─ iPhone
  setText ('iphone.sectionLabel',    iphone?.sectionLabel)
  setText ('iphone.sectionTitle',    iphone?.sectionTitle)
  setText ('iphone.featured.name',   iphone?.featured?.name)
  setText ('iphone.featured.tagline',iphone?.featured?.tagline)
  setText ('iphone.featured.cta',    iphone?.featured?.ctaLabel)
  setImage('iphone.featured.image',  iphone?.featured?.image)
  renderFeatures    (iphone?.featured?.features)
  renderSideProducts(iphone?.sideProducts)
  renderPriceTable  (iphone?.priceTable)

  // ─ Bento
  setText ('bento.ipadPro.badge',   bento?.ipadPro?.badge)
  setText ('bento.ipadPro.name',    bento?.ipadPro?.name)
  setText ('bento.ipadPro.tagline', bento?.ipadPro?.tagline)
  setImage('bento.ipadPro.image',   bento?.ipadPro?.image)
  setText ('bento.macbook.name',    bento?.macbook?.name)
  setText ('bento.macbook.tagline', bento?.macbook?.tagline)
  setImage('bento.macbook.image',   bento?.macbook?.image)
  renderMacbookChips(bento?.macbook?.chips)
  setText('bento.imac.name',        bento?.imac?.name)
  setText('bento.imac.tagline',     bento?.imac?.tagline)
  setText('bento.macStudio.name',   bento?.macStudio?.name)
  setText('bento.macStudio.tagline',bento?.macStudio?.tagline)

  // ─ Accessories
  setText('accessories.sectionLabel', accessories?.sectionLabel)
  setText('accessories.sectionTitle', accessories?.sectionTitle)
  renderAccessories(accessories?.products)

  // ─ Ecosystem
  setText('ecosystem.sectionLabel', ecosystem?.sectionLabel)
  setText('ecosystem.sectionTitle', ecosystem?.sectionTitle)
  renderEcosystemItems(ecosystem?.items)

  // ─ Payment
  setText('payment.title',               payment?.title)
  setText('payment.description',         payment?.description)
  setText('payment.shippingTitle',       payment?.shippingTitle)
  setText('payment.shippingDescription', payment?.shippingDescription)
  setText('payment.warrantyText',        payment?.warrantyText)
  renderPaymentMethods(payment?.methods)
}

document.addEventListener('DOMContentLoaded', init)
