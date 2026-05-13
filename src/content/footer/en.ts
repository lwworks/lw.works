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
          label: 'Automation',
          href: '/automation'
        }
      ]
    },
    {
      heading: 'Special Offers',
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
          label: 'Contact',
          href: '/contact'
        },
        {
          label: 'Legal Notice',
          href: '/impressum'
        },
        {
          label: 'Terms & Conditions',
          href: '/agb'
        },
        {
          label: 'Privacy Policy',
          href: '/datenschutz'
        }
      ]
    }
  ],
  cookieBanner: {
    triggerLabel: 'Cookies',
    title: 'Cookies & Privacy',
    description: 'We use cookies to improve the website and provide you with the best service. By using the website, you agree to the use of cookies.',
    cookies: {
      necessary: {
        label: 'Necessary',
        description:
          'These are cookies and data that are necessary for the use of the website. We store, for example, your preferences for cookies, the website language or the color mode.'
      }
    },
    acceptSelected: 'Accept selected',
    acceptAll: 'Accept all'
  }
}

export default content
