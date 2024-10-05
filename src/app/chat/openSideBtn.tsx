import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={10}
    fill="none"
    {...props}
  >
    <path
      stroke="#7A7A7A"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 5h10m0 0L9.833.835M14 5.001 9.833 9.167"
    />
    <path stroke="#7A7A7A" strokeLinecap="round" strokeWidth={1.5} d="M1 9V1" />
  </svg>
)
export default SvgComponent
