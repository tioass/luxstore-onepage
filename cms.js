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
  "categories": *[_type == "category"] | order(order asc) {
    _id,
    title,
    sectionLabel,
    order
  },
  "products": *[_type == "product"] | order(order asc) {
    name,
    tagline,
    startingPrice,
    features,
    chips,
    "image": image.asset->url,
    "categoryId": category._ref
  },
  "payment": *[_type == "paymentSection" && _id == "paymentSection"][0]{
    title, description,
    methods[]{ label, highlighted },
    shippingTitle, shippingDescription, warrantyText
  }
}`

// ── Mock data (solo en localhost) ─────────────────────────────
const MOCK_DATA = {
  site: {
    brandName: 'Luxstore',
    footerTagline: 'Distribución tech premium para la era digital. Importamos el hardware más innovador del mundo para entusiastas y empresas locales.',
    footerCopyright: '© 2025 Luxstore Distribución Tech Premium. Todos los derechos reservados.',
  },
  hero: {
    headline: 'iPhone 17 Pro',
    subheadline: 'Titanio Inteligente. Cosmic Orange.',
    ctaPrimary: 'Pedilo ahora',
    ctaSecondary: 'Ver más',
    backgroundImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2zDw6kJhHqiBtbJcuMWyA1OfIPMDFxEeOKZ6qVBBEhdkGNs7mC8Md84Sguzc6Tt00qT4Zkf4zNQT7nFUbc-EXe5tTJJ8hb3FNmZ8RGiLIfrxiqm8RvVmtCpSSo3s30kHsrslpPbHaGzriwVlX9qveVVINBhbCi_nserKz1NcZewaCh6oYBtsk2Hz89o3wF1bfxTw9YuA096JMmG-Vwfszwv220Tip7iYdYrl7dT87Rb84xfrrndk1NBwGdd6YHYRMBJEl7q6h2uk',
  },
  categories: [
    { _id: 'cat-iphone',   title: 'iPhone.',            sectionLabel: 'LA LÍNEA',            order: 1 },
    { _id: 'cat-ipad',     title: 'iPad.',              sectionLabel: 'LANZAMIENTO',         order: 2 },
    { _id: 'cat-mac',      title: 'Mac.',               sectionLabel: 'ESTACIÓN DE TRABAJO', order: 3 },
    { _id: 'cat-wearable', title: 'Wearables y Audio.', sectionLabel: 'ESENCIALES',          order: 4 },
    { _id: 'cat-gaming',   title: 'Gaming.',            sectionLabel: 'NEXT-GEN',            order: 5 },
  ],
  products: [
    { categoryId: 'cat-iphone', name: 'iPhone 17 Pro',       tagline: 'El máximo rendimiento. Titanio y chip A19 Pro.', startingPrice: 999, features: ['Chip A19 Pro', 'Acabado en Titanio', 'Teleobjetivo Periscópico 48MP'], image: null },
    { categoryId: 'cat-iphone', name: 'iPhone 17 Air',       tagline: 'El más delgado de la historia.',                 startingPrice: 899, image: null },
    { categoryId: 'cat-iphone', name: 'iPhone 16 Pro Max',   tagline: 'El poder del 16.',                               startingPrice: 1099, image: null },
    { categoryId: 'cat-iphone', name: 'iPhone 16e',          tagline: 'Lo esencial, refinado.',                          startingPrice: 599, image: null },
    { categoryId: 'cat-ipad',   name: 'iPad Pro M5',         tagline: 'La pantalla más avanzada del mundo.',             startingPrice: 1099, features: ['Chip M5', 'OLED Ultra Retina XDR', 'Apple Pencil Pro'], image: null },
    { categoryId: 'cat-ipad',   name: 'iPad Air M3',         tagline: 'Potencia y portabilidad en perfecta armonía.',    startingPrice: 799, image: null },
    { categoryId: 'cat-ipad',   name: 'iPad mini 7',         tagline: 'Todo el poder en el tamaño más compacto.',        startingPrice: 499, image: null },
    { categoryId: 'cat-mac',    name: 'MacBook Pro M4 Max',  tagline: 'Para los flujos de trabajo más exigentes.',       startingPrice: 1999, features: ['Chip M4 Max', 'Pantalla Liquid XDR', 'Hasta 128GB RAM'], image: null },
    { categoryId: 'cat-mac',    name: 'Mac Studio M4 Ultra', tagline: 'La bestia en una caja.',                          startingPrice: 1999, image: null },
    { categoryId: 'cat-mac',    name: 'iMac M4',             tagline: 'Colores como nunca viste.',                        startingPrice: 1299, image: null },
    { categoryId: 'cat-mac',    name: 'MacBook Air M3',      tagline: 'Increíblemente delgado. Sorprendentemente potente.', startingPrice: 1099, image: null },
    { categoryId: 'cat-wearable', name: 'Apple Watch Series 11', tagline: 'Más fino. Más rápido. Más inteligente.',      startingPrice: 399, features: ['Always-On 2x más brillante', 'Detección de crash', 'Temperatura corporal'], image: null },
    { categoryId: 'cat-wearable', name: 'AirPods Pro 3',     tagline: 'Audio Adaptativo 2.0.',                           startingPrice: 249, image: null },
    { categoryId: 'cat-wearable', name: 'AirPods Max',       tagline: 'Sonido de Cine Personalizado.',                   startingPrice: 549, image: null },
    { categoryId: 'cat-gaming',   name: 'PlayStation 5 Slim', tagline: 'La consola más potente, ahora más compacta.',     startingPrice: 499, features: ['SSD ultrarrápido', 'Ray tracing', '4K a 120fps'], image: null },
    { categoryId: 'cat-gaming',   name: 'Meta Quest 3S',     tagline: 'Realidad mixta al alcance de todos.',             startingPrice: 299, image: null },
    { categoryId: 'cat-gaming',   name: 'Nintendo Switch 2',  tagline: 'La nueva era del juego portátil.',               startingPrice: 449, image: null },
  ],
  payment: {
    title: 'Pagos y Logística.',
    description: 'Soluciones flexibles tanto para particulares como para distribución mayorista. Pagos en pesos disponibles.',
    methods: [
      { label: 'Zelle',          highlighted: false },
      { label: 'Payoneer',       highlighted: false },
      { label: 'Wise',           highlighted: false },
      { label: 'USDT (TRC-20)',  highlighted: true  },
      { label: 'Transferencia',  highlighted: false },
    ],
    shippingTitle: 'Envíos sin cargo CABA',
    shippingDescription: 'Entrega en el día dentro de Capital Federal. Manipulación segura garantizada.',
    warrantyText: 'Todo el hardware incluye garantía de 1 año global.',
  },
}

// ── Fetch ─────────────────────────────────────────────────────
async function fetchCMS() {
  // En localhost usamos el mock para no depender de Sanity
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.info('[CMS] Modo local → usando datos de placeholder.')
    return MOCK_DATA
  }
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
// Layout: imagen 16:9 cover arriba | contenido abajo
function featuredCard(product) {
  const price = product.startingPrice
    ? `<span class="text-2xl font-mono">USD ${product.startingPrice.toLocaleString('es-AR')}</span>`
    : ''

  const features = product.features?.length
    ? `<ul class="space-y-2 mb-5">
        ${product.features.map(f => `
          <li class="flex items-center gap-2 text-sm text-on-surface-variant">
            <span class="material-symbols-outlined text-primary" style="font-size:16px">check_circle</span>
            ${f}
          </li>`).join('')}
       </ul>`
    : ''

  const image = product.image
    ? `<div class="w-full aspect-video overflow-hidden">
         <img src="${product.image}"
              alt="${product.name}"
              class="w-full h-full object-cover
                     group-hover:scale-105 transition-transform duration-700"/>
       </div>`
    : `<div class="w-full aspect-video bg-surface-container-high"></div>`

  return `
    <div class="h-full bg-surface-container rounded-xl overflow-hidden flex flex-col group">
      ${image}
      <div class="flex-1 p-8 flex flex-col">
        <h3 class="text-2xl font-bold mb-1 leading-tight">${product.name}</h3>
        <p class="text-on-surface-variant text-sm mb-4 leading-relaxed">${product.tagline ?? ''}</p>
        ${features}
        <div class="mt-auto">${price}</div>
      </div>
    </div>`
}

// ── Card: Producto Estándar ───────────────────────────────────
// Layout: imagen 16:9 cover arriba | nombre + precio abajo
function standardCard(product) {
  const price = product.startingPrice
    ? `<span class="font-mono text-sm font-bold shrink-0">USD ${product.startingPrice.toLocaleString('es-AR')}</span>`
    : ''

  const image = product.image
    ? `<div class="w-full aspect-video overflow-hidden">
         <img src="${product.image}"
              alt="${product.name}"
              class="w-full h-full object-cover
                     group-hover:scale-105 transition-transform duration-500"/>
       </div>`
    : `<div class="w-full aspect-video bg-surface-container"></div>`

  return `
    <div class="h-full bg-surface-container-low rounded-xl overflow-hidden flex flex-col group">
      ${image}
      <div class="flex-1 px-5 py-4 flex flex-col justify-between">
        <h4 class="font-bold text-base leading-tight">${product.name}</h4>
        <div class="flex items-end justify-between gap-2 mt-2">
          <p class="text-xs text-on-surface-variant line-clamp-2">${product.tagline ?? ''}</p>
          ${price}
        </div>
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
  console.log('[CMS] init() arrancó')
  if (SANITY_PROJECT_ID === 'TU_PROJECT_ID') {
    console.info('[CMS] Project ID no configurado.')
    return
  }

  let data
  try {
    console.log('[CMS] Fetching desde Sanity...')
    data = await fetchCMS()
    console.log('[CMS] Data recibida:', Object.keys(data))
  } catch (err) {
    console.warn('[CMS] Error fetch:', err.message)
    return
  }

  const { site, hero, categories, products, payment } = data

  // Agrupar productos por categoría
  const sections = (categories ?? []).map(cat => ({
    title: cat.title,
    sectionLabel: cat.sectionLabel,
    products: (products ?? []).filter(p => p.categoryId === cat._id),
  }))
  console.log('[CMS] Categorías:', categories?.length, '| Productos:', products?.length, '| Hero:', hero?.headline)

  setText('site.brandName',       site?.brandName)
  setText('site.footerTagline',   site?.footerTagline)
  setText('site.footerCopyright', site?.footerCopyright)

  setText ('hero.headline',        hero?.headline)
  setText ('hero.subheadline',     hero?.subheadline)
  setText ('hero.ctaPrimary',      hero?.ctaPrimary)
  setText ('hero.ctaSecondary',    hero?.ctaSecondary)
  setImage('hero.backgroundImage', hero?.backgroundImage)

  const container = document.getElementById('dynamic-sections')
  console.log('[CMS] Container encontrado:', !!container, '| Secciones a renderizar:', sections?.length)
  if (container && sections?.length) {
    try {
      container.innerHTML = sections.map(renderSection).join('')
      console.log('[CMS] Secciones renderizadas OK')
    } catch (err) {
      console.error('[CMS] Error al renderizar secciones:', err.message, err.stack)
    }
  }

  setText('payment.title',               payment?.title)
  setText('payment.description',         payment?.description)
  setText('payment.shippingTitle',       payment?.shippingTitle)
  setText('payment.shippingDescription', payment?.shippingDescription)
  setText('payment.warrantyText',        payment?.warrantyText)
  renderPaymentMethods(payment?.methods)
  console.log('[CMS] init() completado')
}

// Con defer el DOM ya está parseado, pero cubrimos ambos casos
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
