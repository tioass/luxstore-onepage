import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'ecosystemSection',
  title: '🎮 Sección — Ecosistema',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionLabel',
      title: 'Etiqueta de sección',
      type: 'string',
      description: 'Ej: MÁS ALLÁ DE APPLE',
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Título de sección',
      type: 'string',
      description: 'Ej: Ecosistema de Alto Rendimiento.',
    }),
    defineField({
      name: 'items',
      title: 'Productos del ecosistema',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'ecosystemItem',
          title: 'Ítem',
          fields: [
            defineField({
              name: 'icon',
              title: 'Ícono (Material Symbol)',
              type: 'string',
              description: 'Nombre del ícono. Ej: smartphone, sports_score, videogame_asset',
            }),
            defineField({ name: 'name',        title: 'Nombre del producto', type: 'string' }),
            defineField({ name: 'description', title: 'Descripción',         type: 'string' }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'description' },
          },
        },
      ],
    }),
  ],
})
