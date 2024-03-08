import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { Link, useLocation} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {logoutSuccess} from "../redux/userSlice"

const DashSidebar = () => {
    const { currentUser } = useSelector(state => state.user)
    const location = useLocation()
    const dispatch = useDispatch()
    const [tab , settab ] = useState('')

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab')
        if(tabFromUrl){
            settab(tabFromUrl)
        }
    },[location.search])

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

  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                {
                    currentUser.isAdmin && (
                        <Link to='/dashboard?tab=dash'>
                            <Sidebar.Item active={tab === 'dash' || !tab} icon={HiChartPie} as='div'>
                                Dashboard
                            </Sidebar.Item>
                        </Link>
                    )
                }
                <Link to="/dashboard/?tab=profile">
                <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? "Admin" : 'User'} labelColor ='dark' as='button'>
                    Profile
                </Sidebar.Item>
                </Link>
                {/* {currentUser.isAdmin && ( */}
                    <Link to="/dashboard?tab=posts">
                    <Sidebar.Item active = {tab === 'posts'}
                        icon={HiDocumentText} as='div'> 
                        Posts
                    </Sidebar.Item>
                </Link>
                
                {currentUser.isAdmin && (
                    <Link to="/dashboard?tab=comments">
                    <Sidebar.Item active = {tab === 'comments'}
                        icon={HiAnnotation} as='div'> 
                        comments
                    </Sidebar.Item>
                </Link>
                )}
                {currentUser.isAdmin && (
                    <Link to="/dashboard?tab=users">
                    <Sidebar.Item active = {tab === 'users'}
                        icon={HiOutlineUserGroup} as='div'> 
                        Users
                    </Sidebar.Item>
                </Link>
                )}
                <Sidebar.Item  icon={HiArrowSmRight} className ='cursor-pointer' onClick={handleLogout}>
                    SignOut
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar
