import {Locale} from '@/i18n.config'
import {allProfiles} from 'contentlayer/generated'
import {NextResponse} from 'next/server'

export async function GET(request: Request, {params}: {params: {lang: Locale; slug: string}}) {
  const {lang, slug} = params
  const profile = allProfiles.find((profile) => profile.slug === slug && profile.language === lang)
  if (!profile) return NextResponse.json({error: 'Bad Request'}, {status: 400})

  var vCardsJS = require('vcards-js')
  var vCard = vCardsJS()
  vCard.firstName = profile.firstname
  vCard.lastName = profile.lastname
  vCard.organization = 'LW Works GmbH'
  vCard.title = profile.description
  vCard.photo.attachFromUrl(profile.avatar)
  if (profile.phone) vCard.workPhone = profile.phone
  if (profile.email) vCard.workEmail = profile.email
  vCard.workUrl = 'https://lw.works/'

  const filename = `${profile.firstname.toLowerCase()}${profile.lastname.toLowerCase()}`
  return new Response(vCard.getFormattedString(), {
    headers: {
      'Content-Type': `text/vcard; name="${filename}.vcf"`,
      'Content-Disposition': `inline; filename="${filename}.vcf"`
    }
  })
}
