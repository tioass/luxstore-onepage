import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: '⚙️  Configuración del Sitio',
  type: 'document',
  fields: [
    defineField({
      name: 'brandName',
      title: 'Nombre de la Marca',
      type: 'string',
      description: 'Aparece en el header y el footer.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'footerTagline',
      title: 'Tagline del Footer',
      type: 'text',
      rows: 2,
      description: 'Texto descriptivo debajo del logo en el footer.',
    }),
    defineField({
      name: 'footerCopyright',
      title: 'Texto de Copyright',
      type: 'string',
      description: 'Ej: © 2025 Luxstore. Todos los derechos reservados.',
    }),
  ],
  preview: {
    select: { title: 'brandName' },
    prepare: ({ title }) => ({ title: `⚙️  ${title ?? 'Sin configurar'}` }),
  },
})
