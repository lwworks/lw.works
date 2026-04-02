import {withBotId} from 'botid/next/config'
import type {NextConfig} from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {}

const withNextIntl = createNextIntlPlugin()
export default withBotId(withNextIntl(nextConfig))
