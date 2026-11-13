const labels: Record<string, string> = {
  mobile: 'Mobil',
  work: 'Arbeit',
  home: 'Zuhause',
  other: 'Sonstige',
  main: 'Hauptnummer',
  workMobile: 'Mobil (Arbeit)',
  homeFax: 'Fax (Zuhause)',
  workFax: 'Fax (Arbeit)',
  otherFax: 'Fax',
  pager: 'Pager',
  workPager: 'Pager (Arbeit)',
  googleVoice: 'Google Voice',
}

/** German label for a Google Contacts email or phone type. A custom label is shown as it is. */
export const formatValueType = (type: string | null) => (type ? (labels[type] ?? type) : null)
