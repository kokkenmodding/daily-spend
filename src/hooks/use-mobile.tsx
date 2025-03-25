
import * as React from "react"

const MOBILE_BREAKPOINT = 768 // Below this width is considered mobile

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check on initial load
    checkMobile()
    
    // Check on resize
    window.addEventListener("resize", checkMobile)
    
    // Also use matchMedia for more consistent behavior
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }
    
    mql.addEventListener("change", onChange)
    
    return () => {
      window.removeEventListener("resize", checkMobile)
      mql.removeEventListener("change", onChange)
    }
  }, [])

  return isMobile === undefined ? false : isMobile
}
