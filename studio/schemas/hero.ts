import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'hero',
  title: '🚀 Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Título principal',
      type: 'string',
      description: 'Ej: iPhone 17 Pro',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subtítulo',
      type: 'string',
      description: 'Ej: Titanio Inteligente. Cosmic Orange.',
    }),
    defineField({
      name: 'ctaPrimary',
      title: 'Botón principal (texto)',
      type: 'string',
      description: 'Ej: Pedilo ahora',
    }),
    defineField({
      name: 'ctaSecondary',
      title: 'Botón secundario (texto)',
      type: 'string',
      description: 'Ej: Ver más',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Imagen de fondo',
      type: 'image',
      options: { hotspot: true },
      description: 'Imagen de fondo del hero. Recomendado: 1440×900px.',
    }),
  ],
})
