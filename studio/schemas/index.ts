import siteSettings  from './siteSettings'
import hero          from './hero'
import product       from './product'
import section       from './section'
import paymentSection from './paymentSection'

export const schemaTypes = [
  // Singletons
  siteSettings,
  hero,
  paymentSection,
  // Documentos (múltiples instancias)
  section,
  product,
]
