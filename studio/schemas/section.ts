import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'section',
  title: 'Sección',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título de la sección',
      type: 'string',
      description: 'Ej: iPhone. / iPad. / Wearables y Audio.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'sectionLabel',
      title: 'Etiqueta superior',
      type: 'string',
      description: 'Texto pequeño en mayúsculas. Ej: LA LÍNEA / LANZAMIENTO / ESENCIALES',
    }),
    defineField({
      name: 'order',
      title: 'Orden de aparición',
      type: 'number',
      description: 'Número menor = aparece antes. Ej: 1, 2, 3...',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'products',
      title: 'Productos',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'El primer producto será el destacado (card grande). Recomendado: entre 3 y 5 productos por sección.',
    }),
  ],
  orderings: [
    {
      title: 'Orden de aparición',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'order',
    },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: `Posición ${subtitle ?? '—'}`,
    }),
  },
})
