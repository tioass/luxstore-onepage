import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Luxstore')
    .items([
      // ── Singletons ──────────────────────────────────────────
      S.listItem()
        .title('⚙️  Configuración del Sitio')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('⚙️  Configuración del Sitio')
        ),

      S.listItem()
        .title('🚀 Hero')
        .id('hero')
        .child(
          S.document()
            .schemaType('hero')
            .documentId('hero')
            .title('🚀 Hero')
        ),

      S.listItem()
        .title('💳 Pagos y Logística')
        .id('paymentSection')
        .child(
          S.document()
            .schemaType('paymentSection')
            .documentId('paymentSection')
            .title('💳 Pagos y Logística')
        ),

      S.divider(),

      // ── Contenido dinámico ───────────────────────────────────
      S.documentTypeListItem('section')
        .title('📂 Secciones'),

      S.documentTypeListItem('product')
        .title('🛍️  Productos'),
    ])
