
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(() => {
    // Initialize with the current window width on first render
    return typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  })

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
  }, [])

  return isMobile
}
