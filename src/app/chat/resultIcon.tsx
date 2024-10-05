import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={22}
    fill="none"
    {...props}
  >
    <path
      stroke="#222"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12.556 2.818H17V21H1V2.818h4.444m0 10 2.667 2.728 5.333-5.455m-8-4.546h7.112V1H5.444v4.545Z"
    />
  </svg>
)
export default SvgComponent
