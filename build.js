#!/usr/bin/env node
// =============================================================
//  build.js — Pre-renderiza index.html con datos de Sanity
//  Resultado: dist/index.html con todo el contenido baked-in
//  → SEO perfecto, cero blink, carga instantánea
// =============================================================

const fs = require('fs')
const path = require('path')

const PROJECT_ID = 'syny9o6g'
const DATASET    = 'production'
const API_VER    = '2024-01-01'

const QUERY = `{
  "site": *[_type == "siteSettings" && _id == "siteSettings"][0]{
    brandName, footerTagline, footerCopyright
  },
  "hero": *[_type == "hero" && _id == "hero"][0]{
    headline, subheadline, ctaPrimary, ctaSecondary,
    "backgroundImage": backgroundImage.asset->url
  },
  "categories": *[_type == "category"] | order(order asc) {
    _id, title, sectionLabel, order
  },
  "products": *[_type == "product"] | order(order asc) {
    name, tagline, startingPrice, features, chips,
    "image": image.asset->url,
    "categoryId": category._ref
  },
  "payment": *[_type == "paymentSection" && _id == "paymentSection"][0]{
    title, description,
    methods[]{ label, highlighted },
    shippingTitle, shippingDescription, warrantyText
  }
}`

// ── Fetch Sanity ──────────────────────────────────────────────
async function fetchSanity() {
  const url = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VER}/data/query/${DATASET}?query=${encodeURIComponent(QUERY)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sanity HTTP ${res.status}`)
  const { result } = await res.json()
  return result
}

// ── Escape HTML ───────────────────────────────────────────────
function esc(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── Sanity image optimization ─────────────────────────────────
// Appends ?w=WIDTH&fm=webp&q=80 to Sanity CDN URLs for smaller files
function optimizeImage(url, width = 800) {
  if (!url) return null
  // Only optimize Sanity CDN images
  if (url.includes('cdn.sanity.io')) {
    return `${url}?w=${width}&fm=webp&q=80&auto=format`
  }
  return url
}

// ── Card HTML generators ──────────────────────────────────────
function featuredCard(p) {
  const price = p.startingPrice
    ? `<span class="text-2xl font-mono font-bold text-primary">USD ${Number(p.startingPrice).toLocaleString('es-AR')}</span>`
    : ''

  const features = p.features?.length
    ? `<ul class="space-y-2 mb-6">${p.features.map(f =>
        `<li class="flex items-center gap-2.5 text-sm text-on-surface-variant">
           <span class="material-symbols-outlined text-primary" style="font-size:18px;font-variation-settings:'FILL' 1">check_circle</span>
           ${esc(f)}
         </li>`).join('')}</ul>`
    : ''

  const imgUrl = optimizeImage(p.image, 800)
  const image = imgUrl
    ? `<div class="w-full aspect-[4/3] overflow-hidden bg-surface-container-high">
         <img src="${esc(imgUrl)}" alt="${esc(p.name)}" loading="lazy" decoding="async"
              width="800" height="600"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
       </div>`
    : `<div class="w-full aspect-[4/3] bg-surface-container-high flex items-center justify-center">
         <span class="material-symbols-outlined text-6xl text-outline-variant/30" aria-hidden="true">image</span>
       </div>`

  return `
    <article class="h-full bg-surface-container rounded-2xl overflow-hidden flex flex-col group
                border border-outline-variant/10 hover:border-primary/30 transition-colors duration-300">
      ${image}
      <div class="flex-1 p-6 md:p-8 flex flex-col">
        <h3 class="text-xl md:text-2xl font-bold mb-2 leading-tight">${esc(p.name)}</h3>
        <p class="text-on-surface-variant text-sm mb-5 leading-relaxed">${esc(p.tagline)}</p>
        ${features}
        <div class="mt-auto pt-4 border-t border-outline-variant/10">${price}</div>
      </div>
    </article>`
}

function standardCard(p) {
  const price = p.startingPrice
    ? `<span class="font-mono text-sm font-bold text-primary">USD ${Number(p.startingPrice).toLocaleString('es-AR')}</span>`
    : ''

  const imgUrl = optimizeImage(p.image, 500)
  const image = imgUrl
    ? `<div class="w-full aspect-[3/2] overflow-hidden bg-surface-container-high">
         <img src="${esc(imgUrl)}" alt="${esc(p.name)}" loading="lazy" decoding="async"
              width="500" height="333"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
       </div>`
    : `<div class="w-full aspect-[3/2] bg-surface-container-high flex items-center justify-center">
         <span class="material-symbols-outlined text-4xl text-outline-variant/30" aria-hidden="true">image</span>
       </div>`

  return `
    <article class="h-full bg-surface-container-low rounded-2xl overflow-hidden flex flex-col group
                border border-outline-variant/10 hover:border-primary/30 transition-colors duration-300">
      ${image}
      <div class="flex-1 p-5 flex flex-col">
        <h4 class="font-bold text-base leading-tight mb-1">${esc(p.name)}</h4>
        <p class="text-xs text-on-surface-variant line-clamp-2 mb-3 leading-relaxed">${esc(p.tagline)}</p>
        <div class="mt-auto">${price}</div>
      </div>
    </article>`
}

function sectionHeader(section) {
  return `
    <div class="mb-10">
      ${section.sectionLabel
        ? `<span class="text-xs tracking-[0.2em] text-primary mb-3 block uppercase font-bold">${esc(section.sectionLabel)}</span>`
        : ''}
      <h2 class="text-4xl md:text-6xl font-bold tracking-tight">${esc(section.title)}</h2>
    </div>`
}

function renderSection(section) {
  if (!section.products?.length) return ''
  const products = section.products
  const total = products.length

  if (total === 1) {
    return `
      <section class="py-20 px-6 md:px-12 max-w-[1440px] mx-auto">
        ${sectionHeader(section)}
        <div class="max-w-2xl">${featuredCard(products[0])}</div>
      </section>`
  }

  if (total === 2) {
    return `
      <section class="py-20 px-6 md:px-12 max-w-[1440px] mx-auto">
        ${sectionHeader(section)}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${products.map(p => `<div>${standardCard(p)}</div>`).join('')}
        </div>
      </section>`
  }

  const rightCols = products.length - 1 <= 2 ? 1 : 2
  return `
    <section class="py-20 px-6 md:px-12 max-w-[1440px] mx-auto">
      ${sectionHeader(section)}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>${featuredCard(products[0])}</div>
        <div class="grid grid-cols-${rightCols} gap-4 auto-rows-min">
          ${products.slice(1).map(p => `<div>${standardCard(p)}</div>`).join('')}
        </div>
      </div>
    </section>`
}

function renderPaymentMethods(methods) {
  if (!methods?.length) return null
  return methods.map(m =>
    `<span class="px-6 py-3 rounded-full font-mono text-sm ${
      m.highlighted
        ? 'bg-primary-container text-on-primary-container'
        : 'bg-surface-container border border-outline-variant/20'
    }">${esc(m.label)}</span>`
  ).join('\n        ')
}

// ── Text replacement in HTML ──────────────────────────────────
function replaceDataCms(html, key, value) {
  if (value == null) return html
  // Match elements with data-cms="key" and replace their text content
  const regex = new RegExp(
    `(data-cms="${key.replace('.', '\\.')}"[^>]*>)[\\s\\S]*?(</)`,
    'g'
  )
  return html.replace(regex, `$1\n      ${esc(value)}\n    $2`)
}

function replaceDataCmsSrc(html, key, url) {
  if (!url) return html
  const regex = new RegExp(
    `(data-cms-src="${key.replace('.', '\\.')}"[\\s\\S]*?)src="[^"]*"`,
    'g'
  )
  return html.replace(regex, `$1src="${esc(url)}"`)
}

// ── SEO meta tags ─────────────────────────────────────────────
function injectMeta(html, data) {
  const { site, hero } = data
  const title = site?.brandName || 'Luxstore'
  const description = site?.footerTagline || ''

  const metaTags = `
<meta name="description" content="${esc(description)}"/>
<meta property="og:title" content="${esc(title)} | Distribución Tech Premium"/>
<meta property="og:description" content="${esc(description)}"/>
<meta property="og:type" content="website"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(title)}"/>
<meta name="twitter:description" content="${esc(description)}"/>`

  // Insert after <title>
  return html.replace('</title>', `</title>${metaTags}`)
}

// ── Main build ────────────────────────────────────────────────
async function build() {
  console.log('🔨 Build arrancando...')

  // 1. Fetch data
  console.log('📡 Fetching datos de Sanity...')
  const data = await fetchSanity()
  const { site, hero, categories, products, payment } = data
  console.log(`   ✓ ${categories?.length ?? 0} categorías, ${products?.length ?? 0} productos`)

  // 2. Read template
  const templatePath = path.join(__dirname, 'index.html')
  let html = fs.readFileSync(templatePath, 'utf-8')

  // 3. Remove cms.js script tag (no longer needed at runtime)
  html = html.replace(/<script src="cms\.js" defer><\/script>\n?/, '')

  // 4. Inject SEO meta tags
  html = injectMeta(html, data)

  // 5. Replace data-cms text fields
  html = replaceDataCms(html, 'site.brandName', site?.brandName)
  html = replaceDataCms(html, 'site.footerTagline', site?.footerTagline)
  html = replaceDataCms(html, 'site.footerCopyright', site?.footerCopyright)
  html = replaceDataCms(html, 'hero.headline', hero?.headline)
  html = replaceDataCms(html, 'hero.subheadline', hero?.subheadline)
  html = replaceDataCms(html, 'hero.ctaPrimary', hero?.ctaPrimary)
  html = replaceDataCms(html, 'hero.ctaSecondary', hero?.ctaSecondary)
  html = replaceDataCms(html, 'payment.title', payment?.title)
  html = replaceDataCms(html, 'payment.description', payment?.description)
  html = replaceDataCms(html, 'payment.shippingTitle', payment?.shippingTitle)
  html = replaceDataCms(html, 'payment.shippingDescription', payment?.shippingDescription)
  html = replaceDataCms(html, 'payment.warrantyText', payment?.warrantyText)

  // 6. Replace image sources
  html = replaceDataCmsSrc(html, 'hero.backgroundImage', hero?.backgroundImage)

  // 7. Replace payment methods list
  const paymentMethodsHTML = renderPaymentMethods(payment?.methods)
  if (paymentMethodsHTML) {
    html = html.replace(
      /(data-cms-list="payment\.methods"[^>]*>)[\s\S]*?(<\/div>)/,
      `$1\n        ${paymentMethodsHTML}\n      $2`
    )
  }

  // 8. Build dynamic sections
  const sections = (categories ?? []).map(cat => ({
    title: cat.title,
    sectionLabel: cat.sectionLabel,
    products: (products ?? []).filter(p => p.categoryId === cat._id),
  }))

  const sectionsHTML = sections.map(renderSection).join('')

  html = html.replace(
    /<main id="dynamic-sections">[\s\S]*?<\/main>/,
    `<main id="dynamic-sections">\n${sectionsHTML}\n</main>`
  )

  // 9. Write output
  const distDir = path.join(__dirname, 'dist')
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true })

  fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf-8')

  // 10. Copy static assets that might be needed
  const staticFiles = ['favicon.ico', 'robots.txt']
  for (const file of staticFiles) {
    const src = path.join(__dirname, file)
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(distDir, file))
    }
  }

  const sizeKB = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1)
  console.log(`\n✅ Build completo → dist/index.html (${sizeKB} KB)`)
  console.log(`   ${sections.length} secciones, ${products?.length ?? 0} productos pre-renderizados`)
  console.log('   SEO meta tags inyectados')
  console.log('   cms.js eliminado (todo está en el HTML)')
}

build().catch(err => {
  console.error('❌ Build falló:', err.message)
  process.exit(1)
})
