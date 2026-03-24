import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Categoría',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre de la categoría',
      type: 'string',
      description: 'Ej: iPhone, iPad, Mac, Gaming, Accesorios',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'sectionLabel',
      title: 'Etiqueta superior',
      type: 'string',
      description: 'Texto pequeño en mayúsculas sobre el título. Ej: LA LÍNEA, LANZAMIENTO, NEXT-GEN',
    }),
    defineField({
      name: 'order',
      title: 'Orden de aparición',
      type: 'number',
      description: 'Número menor = aparece antes en la página.',
      validation: Rule => Rule.required(),
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
