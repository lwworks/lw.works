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
          label: 'Kontakt',
          href: '/contact'
        },
        {
          label: 'Impressum',
          href: '/impressum'
        },
        {
          label: 'AGB',
          href: '/agb'
        },
        {
          label: 'Datenschutz',
          href: '/datenschutz'
        }
      ]
    }
  ],
  cookieBanner: {
    triggerLabel: 'Cookies',
    title: 'Cookies & Datenschutz',
    description:
      'Wir verwenden Cookies, um die Website zu verbessern und Ihnen den besten Service zu bieten. Durch die Nutzung der Website erklären Sie sich mit der Verwendung von Cookies einverstanden.',
    cookies: {
      necessary: {
        label: 'Technisch notwendig',
        description:
          'Das sind Cookies und Daten, die für die Verwendung der Website notwendig sind. Wir speichern z.B. Deine Präferenzen für Cookies, die Website-Sprache oder den Farbmodus.'
      }
    },
    acceptSelected: 'Auswahl speichern',
    acceptAll: 'Alle akzeptieren'
  }
}

export default content
