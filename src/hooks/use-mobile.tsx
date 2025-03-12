
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create a responsive media query
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Update state on initial load
    setIsMobile(mediaQuery.matches)
    
    // Define the handler
    const handleResize = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }
    
    // Add the listener
    mediaQuery.addEventListener('change', handleResize)
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleResize)
    }
<<<<<<< HEAD
=======
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
>>>>>>> parent of c921424 (implement fireabse services)
  }, [])

  return isMobile
}
