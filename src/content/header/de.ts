import {HeaderContent} from '@/components/sections/header'

const content: HeaderContent = {
  items: [
    {
      label: 'Design Engineering',
      href: '/design-engineering'
    },
    {
      label: 'Automatisierung',
      href: '/automation'
    }
  ],
  cta: {
    label: 'Kontakt',
    href: '/contact'
  },
  langSwitcher: {
    de: 'Deutsch',
    en: 'Englisch'
  },
  themeSwitcher: {
    light: 'Hell',
    dark: 'Dunkel',
    system: 'System'
  }
}

export default content
