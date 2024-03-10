import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { AiOutlineSearch } from "react-icons/ai"
import { Link, useLocation, useNavigate } from 'react-router-dom' 
import { FaMoon ,  FaSun } from 'react-icons/fa'
import { useSelector , useDispatch } from 'react-redux'  
import { toggleTheme } from '../redux/themeSlice'
import { logoutSuccess } from '../redux/userSlice'
import { useEffect, useState } from 'react'

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation()
  const dispatch= useDispatch()
  const { currentUser } = useSelector(state => state.user)
  const { theme } = useSelector(state => state.theme)
  const [searchTerm , setsearchTerm ] = useState('')
  const navigate= useNavigate()

  useEffect(() => {
    const urlparams = new URLSearchParams(location.search)
    const searchTermfromUrl = urlparams.get('searchTerm')
    if(searchTermfromUrl){
      setsearchTerm(searchTermfromUrl)
    }
  },[location.search])

  // handlelogout
  const handleLogout = async () => {
    try{
      const res = await fetch('/api/users/logout' , {
        method : 'POST'
      })
      const data = await res.json()
      if(!res.ok){
        console.log(data.message)
      }else{
        dispatch(logoutSuccess())
      }
    }catch(error){
      console.log(error.message)
    }
  }

  const handlesearch = (e) => {
    e.preventDefault()
    const urlparams = new URLSearchParams(location.search)
    urlparams.set('searchTerm' , searchTerm)
    const searchQuery = urlparams.toString()
    navigate(`/search/?${searchQuery}`)
  }


  return (
    <Navbar className='border-b-2'>
        <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white' >vamsi's</span>
            Blog
        </Link>
        <form onSubmit={handlesearch} >
          <TextInput 
            type='text'
            placeholder='Search...'
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline'
            value={searchTerm}
            onChange={(e) => setsearchTerm(e.target.value)}
          />
        </form>
        <Button type='button' onClick={handlesearch} className='w-12 h-10 lg:hidden' color='gray' pill>
          <AiOutlineSearch />
        </Button>
        <div className='flex gap-2 md:order-2'>
          <Button className='w-12 h-10' color='gray' pill onClick={() => dispatch(toggleTheme())} >
            {theme === 'light' ? <FaSun /> : <FaMoon />}
          </Button>
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt='user'
                  img={currentUser.profilePicture}
                  rounded
                  className='object-cover'
                />
              }
            >
              <Dropdown.Header>
                <span className='block text-sm'>@{currentUser.username}</span>
                <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
              </Dropdown.Header>
              {currentUser.isAdmin && (
                <Link to={'/dashboard?tab=dash'}>
                <Dropdown.Item>Dashboard</Dropdown.Item>
              </Link>
              )}
              {currentUser.isAdmin && <Dropdown.Divider />}
              <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/register">
            <Button gradientDuoTone='purpleToBlue' outline>Sign In
            </Button>
          </Link>
          )}
          <Navbar.Toggle />
        </div>
          <Navbar.Collapse>
            <Navbar.Link active={path == "/"} as={'div'}>
              <Link to='/'>Home</Link>
            </Navbar.Link>
            <Navbar.Link active={path == "/about"} as={'div'}> 
              <Link to='/about'>About</Link>
            </Navbar.Link>
            <Navbar.Link active={path == "/project"} as={'div'}>
              <Link to='/project'>Projects</Link>
            </Navbar.Link>
          </Navbar.Collapse>
    </Navbar>
  )
}
