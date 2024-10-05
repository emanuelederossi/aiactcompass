import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#1791E9"
      d="M15.423 16.194h-1.56v3.51h1.56v-3.51ZM6.138.285h-1.56v3.51h1.56V.285Z"
    />
    <path
      fill="#1791E9"
      d="M15.423 3.795V.285h-1.56v3.51c0 .467-.313.78-.781.78H.286v1.56h3.51c.469 0 .781.311.781.779v6.16h1.56v-6.16c0-.468.313-.78.781-.78h12.796v-1.56h-3.51a.782.782 0 0 1-.781-.78Z"
    />
    <path
      fill="#1791E9"
      d="M15.423 13.074v-6.16h-1.56v6.16c0 .468-.313.78-.781.78H.286v1.56h3.51c.469 0 .781.311.781.78v3.509h1.56v-3.51c0-.468.313-.78.781-.78h12.796v-1.56h-3.51a.782.782 0 0 1-.781-.78Z"
    />
  </svg>
)
export default SvgComponent
