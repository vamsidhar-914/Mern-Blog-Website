import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import { LoginStart,LoginSuccess,LoginFailure } from "../redux/userSlice";
import { useDispatch , useSelector } from 'react-redux'
import OAuth from "../components/OAuth"

 
export default function Signin() {
  const[formData , setformData] = useState({})
  const { loading ,error:errorMessage } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange =(e) => {
    setformData({...formData , [e.target.id] : e.target.value.trim()})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!formData.email || !formData.password){
      return dispatch(LoginFailure('please fill out all fields'))
    }
    try{
      //LoginStart
      dispatch(LoginStart())
      const res = await fetch('/api/auth/login',{
        method : 'POST',
        headers : {'Content-Type': 'application/json'},
        body : JSON.stringify(formData)
      })
      const data = await res.json()
      if(data.success === false){
        dispatch(LoginFailure(data.message))
      }
      if(res.ok){
        dispatch(LoginSuccess(data))
        navigate('/dashboard?tab=profile')
      }
    }catch(error){
      dispatch(LoginFailure(error.message))
    }
  }

  return (
  <>
  <div className='min-h-screen mt-20'>
    <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
      {/* left side */ }
      <div className='flex-1'>
      <Link to="/" className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white' >vamsi's</span>
            Blog
        </Link>
        <p className="text-sm mt-5"> 
          This is the demo project.You can signup with your email and password or with google.
        </p>
      </div>
      {/* right side */}
      <div className='flex-1'>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          <div>
            <Label value="Email:" />
            <TextInput 
            type="email" 
            placeholder="email" 
            id="email" 
            onChange={handleChange} />
          </div>
          <div>
            <Label value="Password:" />
            <TextInput 
            type="password" placeholder="password" id="password"  
            onChange={handleChange}/>
          </div>
          <Button gradientDuoTone='purpleToPink' type="submit" disabled={loading}>
        
            {loading ? (
              <>
              <Spinner size='sm'/>
              <span className="pl-3">loading...</span>
              </>
            ) : 'login'}
          </Button>

          <OAuth />

        </form>
        <div className="flex gap-2 text-sm mt-5">
          <span>doesnnt Have an account?</span>
          <Link to="/register" className="text-blue-500">register</Link>
        </div>
        {errorMessage && (
          <Alert className="mt-5" color='red'>
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  </div>
  </>
  )
}
