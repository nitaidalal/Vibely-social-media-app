import { useEffect } from 'react'

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title

    return () => {
      document.title = 'Vibely'
    }
  }, [title])
}

export default usePageTitle
