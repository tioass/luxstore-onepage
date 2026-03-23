import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'iphoneSection',
  title: '📱 Sección — iPhones',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionLabel',
      title: 'Etiqueta de sección',
      type: 'string',
      description: 'Texto pequeño en mayúsculas. Ej: LA LÍNEA',
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Título de sección',
      type: 'string',
      description: 'Ej: iPhone.',
    }),

    // --- Producto destacado ---
    defineField({
      name: 'featuredProduct',
      title: 'Producto destacado (card grande)',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'El iPhone que ocupa el lugar principal.',
    }),

    // --- Lista lateral ---
    defineField({
      name: 'sideProducts',
      title: 'Lista lateral (3 productos)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Los 3 iPhones que aparecen a la derecha del destacado.',
      validation: Rule => Rule.max(3),
    }),

    // --- Tabla de precios ---
    defineField({
      name: 'priceTable',
      title: 'Tabla de precios completa',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'priceRow',
          title: 'Fila',
          fields: [
            defineField({ name: 'model',         title: 'Modelo',            type: 'string' }),
            defineField({ name: 'storage',        title: 'Almacenamiento',    type: 'string' }),
            defineField({ name: 'startingPrice',  title: 'Precio desde (USD)', type: 'number' }),
          ],
          preview: {
            select: { title: 'model', subtitle: 'startingPrice' },
            prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `USD ${subtitle}` : '' }),
          },
        },
      ],
    }),
  ],
})
