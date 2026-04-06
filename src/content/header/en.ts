import {HeaderContent} from '@/components/sections/header'

const content: HeaderContent = {
  items: [
    {
      label: 'Design Engineering',
      href: '/design-engineering'
    },
    {
      label: 'Automation',
      href: '/automation'
    },
    {
      label: 'Blog',
      href: '/blog'
    }
  ],
  cta: {
    label: 'Contact',
    href: '/contact'
  },
  langSwitcher: {
    de: 'German',
    en: 'English'
  },
  themeSwitcher: {
    light: 'Light',
    dark: 'Dark',
    system: 'System'
  }
}

export default content
