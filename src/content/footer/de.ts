import {FooterContent} from '@/components/sections/footer'

const content: FooterContent = {
  copyrightNote: `© LW Works GmbH ${new Date().getFullYear()}`,
  menus: [
    {
      heading: 'Work',
      items: [
        {
          label: 'Design Engineering',
          href: '/design-engineering'
        },
        {
          label: 'Automatisierung',
          href: '/automation'
        }
      ]
    },
    {
      heading: 'Angebote',
      items: [
        {
          label: 'Digital Dealer',
          href: '/digital-dealer'
        }
      ]
    },
    {
      heading: 'Unternehmen',
      items: [
        {
          label: 'Impressum',
          href: '/impressum'
        },
        {
          label: 'Datenschutz',
          href: '/datenschutz'
        },
        {
          label: 'AGB',
          href: '/agb'
        },
        {
          label: 'Kontakt',
          href: '/kontakt'
        }
      ]
    }
  ]
}

export default content
