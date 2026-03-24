import { defineField, defineType } from 'sanity'

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
      description: 'Seleccioná una categoría existente o creá una nueva desde el botón "Create new".',
      validation: Rule => Rule.required(),
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
      name: 'storage',
      title: 'Almacenamiento disponible',
      type: 'string',
      description: 'Ej: 256GB - 2TB',
    }),
    defineField({
      name: 'features',
      title: 'Características destacadas',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Lista de bullet points. Solo para el producto destacado.',
    }),
    defineField({
      name: 'chips',
      title: 'Chips / Tags técnicos',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Ej: M4 Max, Liquid XDR. Solo para Macs.',
    }),
    defineField({
      name: 'image',
      title: 'Imagen del producto',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Texto del botón de acción',
      type: 'string',
      description: 'Ej: Comprar ahora',
    }),
    defineField({
      name: 'order',
      title: 'Orden de aparición',
      type: 'number',
      description: 'Número menor = aparece primero.',
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
      title:    'name',
      subtitle: 'tagline',
      media:    'image',
    },
  },
})
