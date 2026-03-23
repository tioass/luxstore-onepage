import { defineField, defineType } from 'sanity'

// Helper para los campos de una card del bento
const bentoCard = (name: string, title: string, withChips = false, withBadge = false) => {
  const fields: any[] = [
    defineField({ name: 'name',    title: 'Nombre',            type: 'string' }),
    defineField({ name: 'tagline', title: 'Descripción corta', type: 'string' }),
  ]
  if (withBadge) {
    fields.push(defineField({ name: 'badge', title: 'Badge (ej: Lanzamiento)', type: 'string' }))
  }
  if (withChips) {
    fields.push(defineField({
      name: 'chips',
      title: 'Chips / Tags técnicos',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Ej: M4 Max, Liquid XDR',
    }))
  }
  fields.push(defineField({ name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true } }))
  return defineField({ name, title, type: 'object', fields })
}

export default defineType({
  name: 'bentoSection',
  title: '💻 Sección — iPad y Mac',
  type: 'document',
  fields: [
    bentoCard('ipadPro',    'iPad Pro (card grande)',   false, true),
    bentoCard('macbook',    'MacBook Pro',              true,  false),
    bentoCard('imac',       'iMac',                     false, false),
    bentoCard('macStudio',  'Mac Studio',               false, false),
  ],
})
