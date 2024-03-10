import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth' 
import { auth } from '../firebase'
import { useDispatch } from 'react-redux'
import { LoginSuccess } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

export default function OAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handlleGoogleClick = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt : "select_account" })
    try{
      const resultsFromGoogle = await signInWithPopup(auth , provider)
      const res = await fetch("/api/auth/google",{
        method : "POST",
        headers : {
          'Content-Type' : "application/json"
        },
        body : JSON.stringify({
          name : resultsFromGoogle.user.displayName,
          email : resultsFromGoogle.user.email,
          googlePhotoUrl : resultsFromGoogle.user.photoURL
        })
      })
      const data = await res.json()
      if(res.ok){
        dispatch(LoginSuccess(data))
        navigate("/")
      }
    }catch(err){
      console.log(err)
    }
    }

  return (
    <div>
      <Button className='w-96' type='button' gradientDuoTone='pinkToOrange' outline onClick={handlleGoogleClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
      </Button>
    </div>
  )
}
