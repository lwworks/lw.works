import { logoVersion } from "@/lib/company-logo/logo-version"
import { cn } from "@lw/ui/lib/utils"

/**
 * Logo of a company, served by `/unternehmen/[id]/icon` from the logo bucket. `logoKey` versions the URL, so the
 * browser caches each logo for good and a replaced logo shows up immediately.
 */
export const CompanyIcon = ({ companyId, logoKey, size = 14, className }: { companyId: string; logoKey: string | null; size?: number; className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={`/unternehmen/${companyId}/icon?v=${logoVersion(logoKey)}`}
    alt=""
    width={size}
    height={size}
    loading="lazy"
    decoding="async"
    className={cn("shrink-0 rounded-[3px] object-contain", className)}
    style={{ width: size, height: size }}
  />
)
