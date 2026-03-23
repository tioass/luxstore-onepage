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
  sections: [
    {
      title: 'iPhone.',
      sectionLabel: 'LA LÍNEA',
      products: [
        {
          name: 'iPhone 17 Pro',
          tagline: 'El máximo rendimiento. Titanio y chip A19 Pro.',
          startingPrice: 999,
          features: ['Chip A19 Pro', 'Acabado en Titanio', 'Teleobjetivo Periscópico 48MP'],
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9_QfbKLqBdNLf3EHEqiaattsjqZLoTeW8hoQS6KXe_hEU0vwwnKWadHIXhmoCBGyqmv3S5FSSH19LPNtFQg9Yr0stZPsdSoGs33-VU1HxeXKwNeMgHKP3wybEiTrPejw9bj_NoThjRklCdyKk1FL4CGsQa3lFkjqlf6s_1Z7fzmy6plDPn2qT1xG2Wtjpkw0DMKKWj4tln5NkmjMYyYgEJReJUfPdjt55MkVAdIBCbIfoygZQmPDCwNelayNki33GNJfU65gdmA0',
        },
        {
          name: 'iPhone 17 Air',
          tagline: 'El más delgado de la historia.',
          startingPrice: 899,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9_QfbKLqBdNLf3EHEqiaattsjqZLoTeW8hoQS6KXe_hEU0vwwnKWadHIXhmoCBGyqmv3S5FSSH19LPNtFQg9Yr0stZPsdSoGs33-VU1HxeXKwNeMgHKP3wybEiTrPejw9bj_NoThjRklCdyKk1FL4CGsQa3lFkjqlf6s_1Z7fzmy6plDPn2qT1xG2Wtjpkw0DMKKWj4tln5NkmjMYyYgEJReJUfPdjt55MkVAdIBCbIfoygZQmPDCwNelayNki33GNJfU65gdmA0',
        },
        {
          name: 'iPhone 16 Pro Max',
          tagline: 'El poder del 16.',
          startingPrice: 1099,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9_QfbKLqBdNLf3EHEqiaattsjqZLoTeW8hoQS6KXe_hEU0vwwnKWadHIXhmoCBGyqmv3S5FSSH19LPNtFQg9Yr0stZPsdSoGs33-VU1HxeXKwNeMgHKP3wybEiTrPejw9bj_NoThjRklCdyKk1FL4CGsQa3lFkjqlf6s_1Z7fzmy6plDPn2qT1xG2Wtjpkw0DMKKWj4tln5NkmjMYyYgEJReJUfPdjt55MkVAdIBCbIfoygZQmPDCwNelayNki33GNJfU65gdmA0',
        },
        {
          name: 'iPhone 16e',
          tagline: 'Lo esencial, refinado.',
          startingPrice: 599,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9_QfbKLqBdNLf3EHEqiaattsjqZLoTeW8hoQS6KXe_hEU0vwwnKWadHIXhmoCBGyqmv3S5FSSH19LPNtFQg9Yr0stZPsdSoGs33-VU1HxeXKwNeMgHKP3wybEiTrPejw9bj_NoThjRklCdyKk1FL4CGsQa3lFkjqlf6s_1Z7fzmy6plDPn2qT1xG2Wtjpkw0DMKKWj4tln5NkmjMYyYgEJReJUfPdjt55MkVAdIBCbIfoygZQmPDCwNelayNki33GNJfU65gdmA0',
        },
        {
          name: 'iPhone 15',
          tagline: 'Clásico que nunca falla.',
          startingPrice: 699,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9_QfbKLqBdNLf3EHEqiaattsjqZLoTeW8hoQS6KXe_hEU0vwwnKWadHIXhmoCBGyqmv3S5FSSH19LPNtFQg9Yr0stZPsdSoGs33-VU1HxeXKwNeMgHKP3wybEiTrPejw9bj_NoThjRklCdyKk1FL4CGsQa3lFkjqlf6s_1Z7fzmy6plDPn2qT1xG2Wtjpkw0DMKKWj4tln5NkmjMYyYgEJReJUfPdjt55MkVAdIBCbIfoygZQmPDCwNelayNki33GNJfU65gdmA0',
        },
        {
          name: 'iPhone 14',
          tagline: 'Potencia probada, precio imbatible.',
          startingPrice: 549,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9_QfbKLqBdNLf3EHEqiaattsjqZLoTeW8hoQS6KXe_hEU0vwwnKWadHIXhmoCBGyqmv3S5FSSH19LPNtFQg9Yr0stZPsdSoGs33-VU1HxeXKwNeMgHKP3wybEiTrPejw9bj_NoThjRklCdyKk1FL4CGsQa3lFkjqlf6s_1Z7fzmy6plDPn2qT1xG2Wtjpkw0DMKKWj4tln5NkmjMYyYgEJReJUfPdjt55MkVAdIBCbIfoygZQmPDCwNelayNki33GNJfU65gdmA0',
        },
        {
          name: 'iPhone 13',
          tagline: 'El que todos quieren. Siempre disponible.',
          startingPrice: 449,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9_QfbKLqBdNLf3EHEqiaattsjqZLoTeW8hoQS6KXe_hEU0vwwnKWadHIXhmoCBGyqmv3S5FSSH19LPNtFQg9Yr0stZPsdSoGs33-VU1HxeXKwNeMgHKP3wybEiTrPejw9bj_NoThjRklCdyKk1FL4CGsQa3lFkjqlf6s_1Z7fzmy6plDPn2qT1xG2Wtjpkw0DMKKWj4tln5NkmjMYyYgEJReJUfPdjt55MkVAdIBCbIfoygZQmPDCwNelayNki33GNJfU65gdmA0',
        },
        {
          name: 'iPhone SE (3ra gen)',
          tagline: 'El más compacto. Con chip A15 Bionic.',
          startingPrice: 349,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9_QfbKLqBdNLf3EHEqiaattsjqZLoTeW8hoQS6KXe_hEU0vwwnKWadHIXhmoCBGyqmv3S5FSSH19LPNtFQg9Yr0stZPsdSoGs33-VU1HxeXKwNeMgHKP3wybEiTrPejw9bj_NoThjRklCdyKk1FL4CGsQa3lFkjqlf6s_1Z7fzmy6plDPn2qT1xG2Wtjpkw0DMKKWj4tln5NkmjMYyYgEJReJUfPdjt55MkVAdIBCbIfoygZQmPDCwNelayNki33GNJfU65gdmA0',
        },
      ],
    },
    {
      title: 'iPad.',
      sectionLabel: 'LANZAMIENTO',
      products: [
        {
          name: 'iPad Pro M5',
          tagline: 'La pantalla más avanzada del mundo con el chip M5. Disponible en 11" y 13".',
          startingPrice: 1099,
          features: ['Chip M5', 'Pantalla OLED Ultra Retina XDR', 'Apple Pencil Pro compatible'],
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqnhZ4QQH26HQbtAZXGqA6GH3KdHYdYuFMni7W9vOiVXKdCVzWvgCy5-jWYdy2KTA8GjJN_piOEvLCGbZeBwCCHwPqqqWaQxy2XH5J7G471P144S9gdTXUZataxeGioR1JK3AD8wTcAe08ziZlqP-mtX5GomJ8hEQDnF__OuGuUAIv0YEQ3osDfhdIwPIE5IH4H1y9xsyXkJlYyzjIs5aAo0vgxRjgFic0646YRyf8SiRRFgVksdGiaiBKE0AqSre_nYKL9_b1j3w',
        },
        {
          name: 'iPad Air M3',
          tagline: 'Potencia y portabilidad en perfecta armonía.',
          startingPrice: 799,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqnhZ4QQH26HQbtAZXGqA6GH3KdHYdYuFMni7W9vOiVXKdCVzWvgCy5-jWYdy2KTA8GjJN_piOEvLCGbZeBwCCHwPqqqWaQxy2XH5J7G471P144S9gdTXUZataxeGioR1JK3AD8wTcAe08ziZlqP-mtX5GomJ8hEQDnF__OuGuUAIv0YEQ3osDfhdIwPIE5IH4H1y9xsyXkJlYyzjIs5aAo0vgxRjgFic0646YRyf8SiRRFgVksdGiaiBKE0AqSre_nYKL9_b1j3w',
        },
        {
          name: 'iPad mini 7',
          tagline: 'Todo el poder en el tamaño más compacto.',
          startingPrice: 499,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqnhZ4QQH26HQbtAZXGqA6GH3KdHYdYuFMni7W9vOiVXKdCVzWvgCy5-jWYdy2KTA8GjJN_piOEvLCGbZeBwCCHwPqqqWaQxy2XH5J7G471P144S9gdTXUZataxeGioR1JK3AD8wTcAe08ziZlqP-mtX5GomJ8hEQDnF__OuGuUAIv0YEQ3osDfhdIwPIE5IH4H1y9xsyXkJlYyzjIs5aAo0vgxRjgFic0646YRyf8SiRRFgVksdGiaiBKE0AqSre_nYKL9_b1j3w',
        },
      ],
    },
    {
      title: 'Mac.',
      sectionLabel: 'ESTACIÓN DE TRABAJO',
      products: [
        {
          name: 'MacBook Pro M4 Max',
          tagline: 'Diseñada para los flujos de trabajo más exigentes.',
          startingPrice: 1999,
          features: ['Chip M4 Max', 'Pantalla Liquid XDR', 'Hasta 128GB RAM unificada'],
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY04cKIAgSzEvQ7MJNWno3bt3x_qzlmbkfDn7SJacCMsCBodHZzdiuhehENKe7O8QMf40IKoBqq7ZSpKfCEeEiRHhbcS9hhABLkvPCDdKNvmAXwcQilJiXvjFjv49_NeA_bxZI01HEwPVI9X-efu6X4kpqddWsDc-bVcVbXhoy76xpnjkYDIC77tLo5NZYAP37zUg736KvrlCEDUd4mApEvq4Zb_9Ev8g093JRgBwwg-Bk6EPVMUWX-yawEg8LbSitlnmDHWSsTig',
        },
        {
          name: 'Mac Studio M4 Ultra',
          tagline: 'La bestia en una caja.',
          startingPrice: 1999,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY04cKIAgSzEvQ7MJNWno3bt3x_qzlmbkfDn7SJacCMsCBodHZzdiuhehENKe7O8QMf40IKoBqq7ZSpKfCEeEiRHhbcS9hhABLkvPCDdKNvmAXwcQilJiXvjFjv49_NeA_bxZI01HEwPVI9X-efu6X4kpqddWsDc-bVcVbXhoy76xpnjkYDIC77tLo5NZYAP37zUg736KvrlCEDUd4mApEvq4Zb_9Ev8g093JRgBwwg-Bk6EPVMUWX-yawEg8LbSitlnmDHWSsTig',
        },
        {
          name: 'iMac M4',
          tagline: 'Colores como nunca viste.',
          startingPrice: 1299,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY04cKIAgSzEvQ7MJNWno3bt3x_qzlmbkfDn7SJacCMsCBodHZzdiuhehENKe7O8QMf40IKoBqq7ZSpKfCEeEiRHhbcS9hhABLkvPCDdKNvmAXwcQilJiXvjFjv49_NeA_bxZI01HEwPVI9X-efu6X4kpqddWsDc-bVcVbXhoy76xpnjkYDIC77tLo5NZYAP37zUg736KvrlCEDUd4mApEvq4Zb_9Ev8g093JRgBwwg-Bk6EPVMUWX-yawEg8LbSitlnmDHWSsTig',
        },
        {
          name: 'MacBook Air M3',
          tagline: 'Increíblemente delgado. Sorprendentemente potente.',
          startingPrice: 1099,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY04cKIAgSzEvQ7MJNWno3bt3x_qzlmbkfDn7SJacCMsCBodHZzdiuhehENKe7O8QMf40IKoBqq7ZSpKfCEeEiRHhbcS9hhABLkvPCDdKNvmAXwcQilJiXvjFjv49_NeA_bxZI01HEwPVI9X-efu6X4kpqddWsDc-bVcVbXhoy76xpnjkYDIC77tLo5NZYAP37zUg736KvrlCEDUd4mApEvq4Zb_9Ev8g093JRgBwwg-Bk6EPVMUWX-yawEg8LbSitlnmDHWSsTig',
        },
      ],
    },
    {
      title: 'Wearables y Audio.',
      sectionLabel: 'ESENCIALES',
      products: [
        {
          name: 'Apple Watch Series 11',
          tagline: 'Más fino. Más rápido. Más inteligente.',
          startingPrice: 399,
          features: ['Pantalla Always-On 2x más brillante', 'Detección de crash', 'Temperatura corporal'],
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8Q83KSC3f0yZy9hH5wsaWO1E46VwhXRkl9n-1_N1Ht_Y821L8YkLjwNdtX_i7fMedo_5_Z2P1jj5Ij1ZcIeKSS_eglNvGduvVt9_WuE5PhmMy-V3o-cUoihjyzTNrRp5VzO4l1aLkQ0Ehc2Hoa-GWpX6S0awM5zt-_Ie-JoLCouk3nnlliY8NpbqHIhXcro7DQiVSPiqkLfh2mT3ok7i59cMibf1cZfzmmOhceM-OXA8WPFfRH5w-2OrQwKY3B1iafcNFMJtKvwA',
        },
        {
          name: 'AirPods Pro 3',
          tagline: 'Audio Adaptativo 2.0.',
          startingPrice: 249,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2gFxcFWRCyFRuIiykIDkwk1s12GsZoEZPLLM71g47L6E9hv18V34R-BaLkNv8zfPvsVd-ZU9XnxnEq4bJV8GBNxgA_JRfv2HCUlkwzI1yNd55dORH586d-ageR-rX_v777LDTA5aZgblHmIMr4ipeuPKxEYVTBZNsJY6tlNnhFIbAUu4EqAf3zJqrVHtHuVDCJbZNXrZrNqwb1fW26uZKVYUSm9OPleXUVmcnYKpyCgDwiEbIddv6UpLktB4y9fngCPFeY4tKyXg',
        },
        {
          name: 'AirPods Max',
          tagline: 'Sonido de Cine Personalizado.',
          startingPrice: 549,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADI44KCxkWUkNgJq_8mvw9tu-NZfP9yUiM_iNocpdpumc5bsyQXSAtotn9uXS-R7tz-6cYFtAik',
        },
      ],
    },
    {
      title: 'Gaming.',
      sectionLabel: 'NEXT-GEN',
      products: [
        {
          name: 'PlayStation 5 Slim',
          tagline: 'La consola más potente de Sony, ahora más compacta.',
          startingPrice: 499,
          features: ['SSD ultrarrápido', 'Ray tracing en tiempo real', '4K a 120fps'],
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzH_x_hdT_jnVCo5vpWmKHFpeyirnHMelt1FdqMUeTO6LBmbWG9bjrAzbrlgJYxCITczLVz5c7NZD2tFFxuak74XKUTfxKvOveVHcl94E4a8PkYbPFBKst5Qh3Zbaiznhr927V6-8GxcuORQ-PPk-9XcgJaHtklZEFBd8Gv2NB4kD3aXqongk0TTjaue5yUTifofqH__5dHPZWxSM2p3KnzsH2yp_EOzEnbVAirRVit_S4HGwQ0TIzmhU9gIm0V-8ew9Lam8gaUFk',
        },
        {
          name: 'Meta Quest 3S',
          tagline: 'Realidad mixta al alcance de todos.',
          startingPrice: 299,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZrY6Yw8_YrRJOx41sTbUkHD9URw7qKgJaEUT6eS0UqXr2_A24fk8Sb5Rx98LMMPXDwIXGUdcKc3x3lfZNfXxTn35awe7MSJ2vHMReHjn3Wc9k8hgSfLD1WUhu6iLQEyZI3tdF2pMRTUVZU_3aEo3vpKEAFFzpNAlKJ8YhpcxwBEmxwftzNIdP0ZR5LZmmISRd3SeQlFn1VWtRbehpZX79Pjyr4Vtpa1Iigb6od1snZAwFESimqaFrFLXPhXWcuwiCn4hoW0SHTOs',
        },
        {
          name: 'Nintendo Switch 2',
          tagline: 'La nueva era del juego portátil.',
          startingPrice: 449,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzH_x_hdT_jnVCo5vpWmKHFpeyirnHMelt1FdqMUeTO6LBmbWG9bjrAzbrlgJYxCITczLVz5c7NZD2tFFxuak74XKUTfxKvOveVHcl94E4a8PkYbPFBKst5Qh3Zbaiznhr927V6-8GxcuORQ-PPk-9XcgJaHtklZEFBd8Gv2NB4kD3aXqongk0TTjaue5yUTifofqH__5dHPZWxSM2p3KnzsH2yp_EOzEnbVAirRVit_S4HGwQ0TIzmhU9gIm0V-8ew9Lam8gaUFk',
        },
      ],
    },
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
