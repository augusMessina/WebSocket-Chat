import Chat from '@/components/Chat'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useUser from '@/hooks/useUser'


export default function Home() {
  const router = useRouter()

  const [pageLoadnig, setPageLoading] = useState<boolean>(true)

  const {isLogged, isLoading, isValid} = useUser()

  useEffect(() => {
    if (!isLoading && (!isLogged || !isValid)) {
      router.replace('/login')
    }
  }, [isLogged, router, isLoading, isValid])

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 1000)
  }, [])

  if(pageLoadnig){
    return (
      <div>Cargando</div>
    )
  }

  return (
    <>
      <Chat></Chat>
    </>
  )
  
}
