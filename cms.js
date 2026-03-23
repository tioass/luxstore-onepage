// =============================================================
//  cms.js — Luxstore × Sanity  |  Vanilla JS, sin dependencias
// =============================================================

const SANITY_PROJECT_ID = 'syny9o6g'
const SANITY_DATASET    = 'production'
const SANITY_API_VER    = '2024-01-01'

// ── GROQ: un solo request trae todo ──────────────────────────
const QUERY = `{
  "site": *[_type == "siteSettings" && _id == "siteSettings"][0]{
    brandName, footerTagline, footerCopyright
  },
  "hero": *[_type == "hero" && _id == "hero"][0]{
    headline, subheadline, ctaPrimary, ctaSecondary,
    "backgroundImage": backgroundImage.asset->url
  },
  "sections": *[_type == "section"] | order(order asc) {
    title,
    sectionLabel,
    "products": products[]->{
      name,
      tagline,
      startingPrice,
      features,
      chips,
      "image": image.asset->url
    }
  },
  "payment": *[_type == "paymentSection" && _id == "paymentSection"][0]{
    title, description,
    methods[]{ label, highlighted },
    shippingTitle, shippingDescription, warrantyText
  }
}`

// ── Fetch ─────────────────────────────────────────────────────
async function fetchCMS() {
  const url = `https://${SANITY_PROJECT_ID}.apicdn.sanity.io`
            + `/v${SANITY_API_VER}/data/query/${SANITY_DATASET}`
            + `?query=${encodeURIComponent(QUERY)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sanity HTTP ${res.status}`)
  const { result } = await res.json()
  return result
}

// ── Helpers ───────────────────────────────────────────────────
function setText(key, value) {
  if (value == null) return
  document.querySelectorAll(`[data-cms="${key}"]`)
    .forEach(el => { el.textContent = value })
}

function setImage(key, url) {
  if (!url) return
  document.querySelectorAll(`[data-cms-src="${key}"]`)
    .forEach(el => { el.src = url })
}

// ── Bento Grid Layout ─────────────────────────────────────────
//
//  n=1  →  [    0    ]
//  n=2  →  [  0  ][  1  ]
//  n=3  →  [  0  ][1]
//          [  0  ][2]
//  n=4  →  [  0  ][1][2]
//          [  0  ][  3  ]
//  n=5+ →  [  0  ][1][2]
//          [  0  ][3][4]

function bentoColClasses(index, total) {
  if (total === 1) {
    return index === 0 ? 'col-span-4' : ''
  }
  if (total === 2) {
    return 'col-span-2'
  }
  // 3+ — primer card siempre es el featured grande
  if (index === 0) return 'col-span-2 row-span-2'
  if (total === 3) return 'col-span-2'
  if (total === 4) return index === 3 ? 'col-span-2' : 'col-span-1'
  return 'col-span-1' // 5+
}

// ── Card: Producto Destacado (featured) ───────────────────────
function featuredCard(product) {
  const price = product.startingPrice
    ? `<span class="text-2xl font-mono">USD ${product.startingPrice.toLocaleString('es-AR')}</span>`
    : ''

  const features = product.features?.length
    ? `<ul class="space-y-2 mb-6">
        ${product.features.map(f => `
          <li class="flex items-center gap-2 text-sm">
            <span class="material-symbols-outlined text-primary text-sm">check_circle</span>
            ${f}
          </li>`).join('')}
       </ul>`
    : ''

  const image = product.image
    ? `<img
         src="${product.image}"
         alt="${product.name}"
         class="absolute bottom-0 right-0 w-2/3 object-contain opacity-90
                group-hover:scale-105 group-hover:-translate-y-2
                transition-all duration-700 pointer-events-none"/>`
    : ''

  return `
    <div class="bg-surface-container rounded-xl p-10 relative overflow-hidden
                flex flex-col justify-between group min-h-[440px]">
      <div class="relative z-10">
        <h3 class="text-3xl font-bold mb-2">${product.name}</h3>
        <p class="text-on-surface-variant mb-6 max-w-xs">${product.tagline ?? ''}</p>
        ${features}
        ${price}
      </div>
      ${image}
      <div class="absolute inset-0 bg-gradient-to-tr from-surface-container via-transparent to-transparent pointer-events-none"></div>
    </div>`
}

// ── Card: Producto Estándar ───────────────────────────────────
function standardCard(product) {
  const price = product.startingPrice
    ? `<span class="font-mono text-sm">USD ${product.startingPrice.toLocaleString('es-AR')}</span>`
    : ''

  const image = product.image
    ? `<img
         src="${product.image}"
         alt="${product.name}"
         class="h-24 w-24 object-contain flex-shrink-0
                group-hover:scale-110 transition-transform duration-500"/>`
    : ''

  return `
    <div class="bg-surface-container-low rounded-xl p-7 relative overflow-hidden
                flex flex-col justify-between group min-h-[200px]">
      <div>
        <h4 class="font-bold text-lg leading-tight">${product.name}</h4>
        <p class="text-sm text-on-surface-variant mt-1 line-clamp-2">${product.tagline ?? ''}</p>
      </div>
      <div class="flex items-end justify-between mt-4 gap-2">
        ${price}
        ${image}
      </div>
    </div>`
}

// ── Render de una Sección ─────────────────────────────────────
function renderSection(section) {
  if (!section.products?.length) return ''

  const products = section.products
  const total    = products.length

  const cards = products.map((product, i) => {
    const colClasses = bentoColClasses(i, total)
    const cardHTML   = i === 0 && total !== 2
      ? featuredCard(product)
      : standardCard(product)

    return `<div class="${colClasses}">${cardHTML}</div>`
  }).join('')

  return `
    <section class="py-24 px-12 max-w-[1440px] mx-auto">
      <div class="mb-12">
        ${section.sectionLabel
          ? `<span class="text-xs tracking-[0.2em] text-primary mb-4 block uppercase font-bold">
               ${section.sectionLabel}
             </span>`
          : ''}
        <h2 class="text-4xl md:text-6xl font-bold tracking-tight">${section.title}</h2>
      </div>
      <div class="grid grid-cols-4 gap-3 auto-rows-[220px]">
        ${cards}
      </div>
    </section>`
}

// ── Render de Métodos de Pago ─────────────────────────────────
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
  if (SANITY_PROJECT_ID === 'TU_PROJECT_ID') {
    console.info('[CMS] Project ID no configurado. Mostrando contenido estático.')
    return
  }

  let data
  try {
    data = await fetchCMS()
  } catch (err) {
    console.warn('[CMS] No se pudo cargar el contenido:', err.message)
    return
  }

  const { site, hero, sections, payment } = data

  // ─ Site
  setText('site.brandName',       site?.brandName)
  setText('site.footerTagline',   site?.footerTagline)
  setText('site.footerCopyright', site?.footerCopyright)

  // ─ Hero
  setText ('hero.headline',        hero?.headline)
  setText ('hero.subheadline',     hero?.subheadline)
  setText ('hero.ctaPrimary',      hero?.ctaPrimary)
  setText ('hero.ctaSecondary',    hero?.ctaSecondary)
  setImage('hero.backgroundImage', hero?.backgroundImage)

  // ─ Secciones dinámicas
  const container = document.getElementById('dynamic-sections')
  if (container && sections?.length) {
    container.innerHTML = sections.map(renderSection).join('')
  }

  // ─ Payment
  setText('payment.title',               payment?.title)
  setText('payment.description',         payment?.description)
  setText('payment.shippingTitle',       payment?.shippingTitle)
  setText('payment.shippingDescription', payment?.shippingDescription)
  setText('payment.warrantyText',        payment?.warrantyText)
  renderPaymentMethods(payment?.methods)
}

document.addEventListener('DOMContentLoaded', init)
