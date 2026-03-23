import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'paymentSection',
  title: '💳 Sección — Pagos y Logística',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título de sección',
      type: 'string',
      description: 'Ej: Pagos y Logística.',
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      description: 'Texto introductorio de la sección.',
    }),
    defineField({
      name: 'methods',
      title: 'Métodos de pago',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'paymentMethod',
          title: 'Método',
          fields: [
            defineField({ name: 'label',       title: 'Nombre',    type: 'string' }),
            defineField({
              name: 'highlighted',
              title: '¿Destacado?',
              type: 'boolean',
              description: 'Aparece en azul/primario para resaltarlo.',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'highlighted' },
            prepare: ({ title, subtitle }) => ({
              title,
              subtitle: subtitle ? '⭐ Destacado' : '',
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'shippingTitle',
      title: 'Título de envío',
      type: 'string',
      description: 'Ej: Envíos sin cargo CABA',
    }),
    defineField({
      name: 'shippingDescription',
      title: 'Descripción de envío',
      type: 'string',
      description: 'Ej: Entrega en el día dentro de Capital Federal.',
    }),
    defineField({
      name: 'warrantyText',
      title: 'Texto de garantía',
      type: 'string',
      description: 'Ej: Todo el hardware incluye garantía de 1 año global.',
    }),
  ],
})
