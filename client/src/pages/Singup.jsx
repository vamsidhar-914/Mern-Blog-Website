import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import { faCheck , faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OAuth from "../components/OAuth";
import { AiFillGoogleCircle } from "react-icons/ai";

const USER_REGEX = /^[^\s][a-zA-Z][a-zA-Z0-9-_]{6,23}$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
const emailRegex = /^[a-zA-Z]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export default function Singup() {
  const userRef = useRef()
  const errRef = useRef()

  const[formData , setformData] = useState({})
  const[errorMessage , seterrorMessage] = useState(null)
  const [loading ,setloading] = useState(false)
  const [validname , setvalidname] = useState(false)
  const [userFocus , setuserFocus] = useState(false)

  const [validemail , setvalidemail] = useState(false)
  const [emailFocus , setemailFocus] = useState(false)

  const [validpwd , setvalidpwd] = useState(false)
  const [pwdFocus , setpwdFocus] = useState(false)
  const navigate = useNavigate()


  useEffect(() => {
    userRef.current.focus()
  },[])

  useEffect(() => {
    const result = USER_REGEX.test(formData.username)
    setvalidname(result)
  },[formData.username])


  useEffect(() => {
    const result = PWD_REGEX.test(formData.password)
    setvalidpwd(result)
  },[formData.password])

  useEffect(() => {
    const result = emailRegex.test(formData.email)
    setvalidemail(result)
  },[formData.email])

  // useEffect(() => {
  //   seterrorMessage('')
  // },[formData])

  const handleChange =(e) => {
    setformData({...formData , [e.target.id] : e.target.value.trim()})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // if button enabled with js hack
    const v1 = USER_REGEX.test(formData.username)
    const v2 = PWD_REGEX.test(formData.password)
    if(!v1 || !v2){
      seterrorMessage("Invalid entry")
      return;
    }
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
        setloading(false)
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
      errRef.current.focus()
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
            <span className={validname ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck}/>
            </span>
            <span className={validname || !formData.username ? 'hide' : "invalid"}>
                    <FontAwesomeIcon icon={faTimes}/>
            </span>
            <TextInput 
              type="username"
              placeholder="username"
              id="username"
              onChange={handleChange}
              required
              aria-invalid={validname ? "false" : 'true'}
              aria-describedby="uidnote"
              onFocus={() => setuserFocus(true)}
              onBlur={() => setuserFocus(false)}
              ref={userRef}
              />
              <p id="uidnote" className={userFocus && formData.username && !validname ? 'instructions' : 'offscreen'}>
                <FontAwesomeIcon icon={faInfoCircle} />
                7 to 24 characters.<br />
                must begin with a letter.<br />
                letters , numbers,underscore,hyphens allowed
              </p>
          </div>
          <div>
            <Label value="Email:" />
            <span className={validemail ? 'valid' : 'hide'}>
                    <FontAwesomeIcon icon={faCheck}/>
                </span>
                <span className={validemail || !formData.email ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes}/>
                </span>
            <TextInput 
            type="email" 
            placeholder="email" 
            id="email" 
            required
            aria-invalid={validemail ? "false" : "true"}
            aria-describedby="emailidnote"
            onFocus={() => setemailFocus(true)}
            onBlur={() => setemailFocus(false)}
            onChange={handleChange} /> 
            <p id="emailidnote" className={emailFocus && formData.email && !validemail ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle}/>
              Invalid email <br />
              cannot include charcters like . _ - <br />
              cannot allow special charcters <span aria-label="exclamation mark">!</span> <span aria-label="hashtag">#</span>
              <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>           
          </div>
          <div>
            <Label value="Password:" />
            <span className={validpwd ? 'valid' : 'hide'}>
                    <FontAwesomeIcon icon={faCheck}/>
                </span>
                <span className={validpwd || !formData.password ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes}/>
                </span>
            <TextInput 
            type="password" placeholder="password" id="password"  
            onChange={handleChange}
            aria-invalid = {validpwd ? "false" : "true"}
            aria-describedby="pwdnote"
            onFocus={() => setpwdFocus(true)}
            onBlur={() => setpwdFocus(false)}
            />
            <p id="pwdnote" className={pwdFocus && formData.password &&  !validpwd ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle}/>
                8 to 24 characters.<br />
                must include uppercase and lowercase letters, a number and a special character.<br />
                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="hashtag">#</span>
                <span aria-label='at symbol'>@</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>
          </div>
          <Button gradientDuoTone='purpleToPink' type="submit" disabled={loading}>
        
            {loading == true ? (
              <>
              <Spinner size='sm'/>
              <span className="pl-3">loading...</span>
              </>
            ) : 'register'}
          </Button>

          {/* OAuth functionality */}
          <OAuth />

        </form>
        <div className="flex gap-2 text-sm mt-5">
          <span>Have an account?</span>
          <Link to="/login" className="text-blue-500">Login</Link>
        </div>
        {errorMessage && (
          <Alert className="mt-5" color='red' ref={errRef}>
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  </div>
  </>
  )
}
