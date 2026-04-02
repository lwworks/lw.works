import {FooterContent} from '@/components/sections/footer'

const content: FooterContent = {
  copyrightNote: `© LW Works GmbH ${new Date().getFullYear()}`,
  menus: [
    {
      heading: 'Work',
      items: [
        {
          label: 'Development',
          href: '/web-dev'
        },
        {
          label: 'Automation',
          href: '/automation'
        },
        {
          label: 'Blog',
          href: '/blog'
        }
      ]
    },
    {
      heading: 'Offers',
      items: [
        {
          label: 'Digital Dealer',
          href: '/digital-dealer'
        }
      ]
    },
    {
      heading: 'Company',
      items: [
        {
          label: 'Legal Notice',
          href: '/impressum'
        },
        {
          label: 'Privacy Policy',
          href: '/datenschutz'
        },
        {
          label: 'Terms & Conditions',
          href: '/agb'
        },
        {
          label: 'Contact',
          href: '/kontakt'
        }
      ]
    }
  ]
}

export default content
