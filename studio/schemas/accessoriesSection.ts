import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'accessoriesSection',
  title: '🎧 Sección — Wearables y Audio',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionLabel',
      title: 'Etiqueta de sección',
      type: 'string',
      description: 'Texto pequeño en mayúsculas. Ej: ESENCIALES',
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Título de sección',
      type: 'string',
      description: 'Ej: Wearables y Audio.',
    }),
    defineField({
      name: 'products',
      title: 'Productos (máx. 3)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Los 3 productos que aparecen en las cards de esta sección.',
      validation: Rule => Rule.max(3),
    }),
  ],
})
