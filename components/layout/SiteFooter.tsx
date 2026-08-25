import { SocialLinks } from '@/components/ui/SocialLinks'
import { Footer } from './Footer'

interface Props {
  showDiscord?: boolean
}

export function SiteFooter({ showDiscord = true }: Props) {
  return (
    <>
      <SocialLinks showDiscord={showDiscord} />
      <Footer />
    </>
  )
}
