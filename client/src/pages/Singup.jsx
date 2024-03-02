import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link , useNavigate } from "react-router-dom";


export default function Singup() {
  const[formData , setformData] = useState({})
  const[errorMessage , seterrorMessage] = useState(null)
  const [loading ,setloading] = useState(false)
  const navigate = useNavigate()

  const handleChange =(e) => {
    setformData({...formData , [e.target.id] : e.target.value.trim()})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!formData.username || !formData.email || !formData.password){
      seterrorMessage("Please fill out all fields")
    }
    try{
      setloading(true)
      seterrorMessage(null)
      const res = await fetch('/api/auth/register',{
        method : 'POST',
        headers : {'Content-Type': 'application/json'},
        body : JSON.stringify(formData)
      })
      if(!res.ok){
        seterrorMessage("all fields are required")
      }
      const data = await res.json()
      if(data.success === false){
        return seterrorMessage(data.message)
      }
      setloading(false)
      if(res.ok){
        navigate('/login')
      }
    }catch(error){
      seterrorMessage(error.message)
      setloading(false)
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
          <div className="">
            <Label value="Username:" />
            <TextInput 
              type="text"
              placeholder="username"
              id="username"
              onChange={handleChange}
              />
          </div>
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
            ) : 'register'}
          </Button>
        </form>
        <div className="flex gap-2 text-sm mt-5">
          <span>Have an account?</span>
          <Link to="/login" className="text-blue-500">Login</Link>
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
