import Chat from '@/components/Chat'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useUser from '@/hooks/useUser'
import UserDataContextProvider from '@/context/UserDataContext'
import { motion } from 'framer-motion'
import { Wrapper } from '@/styles/myStyledComponents'


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
      <Wrapper>
        <div style={{alignSelf: 'center'}} className="big-custom-loader"></div>
      </Wrapper>
    )
  }

  return (
    <>
      <UserDataContextProvider>
        <motion.div
          initial={{opacity: 0, y: 15}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: 15}}
          transition={{delay: 0.25}}
        >
          <Chat></Chat>
        </motion.div>
      </UserDataContextProvider>
    </>
  )
  
}
