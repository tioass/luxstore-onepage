import { defineField, defineType } from 'sanity'
import { CategorySelect } from '../components/CategorySelect'

export default defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre del producto',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Seleccioná una categoría o creá una nueva con el botón +',
      validation: Rule => Rule.required(),
      components: {
        input: CategorySelect,
      },
    }),
    defineField({
      name: 'tagline',
      title: 'Descripción corta',
      type: 'string',
      description: 'Una línea que resume el producto. Ej: El más delgado de la historia.',
    }),
    defineField({
      name: 'startingPrice',
      title: 'Precio desde (USD)',
      type: 'number',
      description: 'Solo el número. Ej: 999',
    }),
    defineField({
      name: 'features',
      title: 'Características destacadas',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Lista de bullet points. Solo para el producto destacado.',
    }),
    defineField({
      name: 'image',
      title: 'Imagen del producto',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title:    'name',
      subtitle: 'tagline',
      media:    'image',
    },
  },
})
