export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'workshop', label: 'Workshop' },
  { id: 'contact', label: 'Contact' },
]

export const TIMELINE = [
  {
    year: '2004',
    title: 'Where it began',
    text: 'Dharmesh Engineering began in 2004 with conventional lathes, capstan lathes and drilling machines. From these beginnings, the business developed its manufacturing experience and established its place in precision component production.',
  },
  {
    year: '2014',
    title: 'Exports to Australia',
    text: 'Began regular exports to Australia, building experience in supplying components to international customers.',
  },
  {
    year: '2016',
    title: 'The first CNC machine',
    text: 'In 2016, we introduced our first CNC machine, marking an important step in the development of our workshop. We continued investing in CNC technology and expanded our equipment to three CNC turning machines.',
  },
  {
    year: 'Today',
    title: 'CNC meets craft',
    text: 'Today, we combine CNC turning with conventional machining experience to manufacture custom brass fittings and turned components according to customer drawings and specifications.',
  },
]

export const OPERATIONS = ['CNC Turning', 'Facing', 'Drilling', 'Boring', 'Tapping', 'Threading', 'Grooving', 'Parting-off', 'Chamfering']
export const MATERIALS = ['Brass', 'SS304', 'SS316', 'Mild Steel', 'Aluminium', 'Engineering Plastics']
export const THREADS = ['BSP', 'Metric', 'UNF', 'NPT']

export const CAP_CARDS = [
  {
    img: 'images/cnc-turning.jpg',
    alt: 'CNC lathe turning a brass component',
    title: 'CNC Turning',
    text: 'Custom-turned components in brass, stainless steel, mild steel, aluminium and selected engineering plastics, subject to part requirements.',
  },
  {
    img: 'images/threaded-components.jpg',
    alt: 'Brass and stainless-steel threaded components',
    title: 'Threaded Components',
    text: 'Components with BSP, metric, UNF and NPT threads, manufactured to customer drawings and specified requirements.',
  },
  {
    img: 'images/production-orders.jpg',
    alt: 'Batch of finished brass components arranged for production',
    title: 'Production Orders',
    text: 'Repeat production runs, with quantities reviewed against each component, material and drawing.',
  },
]

export const QUALITY = [
  'Vernier calipers and micrometers for dimensional checks',
  'Thread gauges for checking specified thread requirements',
  'Plug and ring gauges, where applicable',
  'In-house pressure leak testing for applicable components',
]

export const SPARKS = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 47) % 100,
  size: 3 + ((i * 7) % 5),
  dur: 7 + ((i * 3) % 9),
  delay: -((i * 5) % 11),
  drift: ((i * 13) % 80) - 40,
}))

export const MARQUEE_ITEMS = [
  'Brass fittings',
  'CNC turning',
  'SS304 · SS316',
  'BSP · Metric · UNF · NPT',
  'Made to drawing',
  'Threading',
  'Pressure leak testing',
  'Bilimora, Gujarat',
]

export const STATS = [
  { n: 2004, label: 'Year established', raw: true },
  { n: 3, label: 'CNC turning machines' },
  { n: 12, label: 'People on our team' },
  { n: 2014, label: 'Exporting to Australia since', raw: true },
]

import contactConfig from '../config/contact.json';

export const CNC_MACHINES = [
  { name: 'Jyoti DX-200-3A', capacity: 92 },
  { name: 'Jyoti DX-200-3', capacity: 86 },
  { name: 'Jyoti DX-100', capacity: 64 },
]

export const CONVENTIONAL_EQUIPMENT = [
  { quantity: '3', name: 'Conventional lathes' },
  { quantity: '2', name: 'Drilling machines' },
  { quantity: '1', name: 'Tapping machine' },
]

export const FORM_MIN_REVIEW_TIME_MS = 3000
export const MAX_DRAWING_FILE_SIZE_BYTES = 5 * 1024 * 1024
export const ACCEPTED_DRAWING_MIME_TYPES = ['application/pdf', 'image/jpeg']
export const CONTACT_EMAIL = contactConfig.email
export const CONTACT_PHONE = contactConfig.phone
export const CONTACT_PHONE_TEL = `+${CONTACT_PHONE.replace(/\D/g, '')}`

export const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzPAMatimjzDemwXtmilBEQWAy4yx3CDau-tXsUnVC7dja7oRxGZqPlxu2Vv05ghlZztA/exec'
