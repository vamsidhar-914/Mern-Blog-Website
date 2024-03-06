import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { Link, useLocation} from 'react-router-dom'
import { useSelector } from 'react-redux'

const DashSidebar = () => {
    const { currentUser } = useSelector(state => state.user)
    const location = useLocation()
    const [tab , settab ] = useState('')
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab')
        if(tabFromUrl){
            settab(tabFromUrl)
        }
    },[location.search])
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
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
                    <Link to="/dashboard?tab=users">
                    <Sidebar.Item active = {tab === 'users'}
                        icon={HiOutlineUserGroup} as='div'> 
                        Users
                    </Sidebar.Item>
                </Link>
                )}
                <Sidebar.Item  icon={HiArrowSmRight} className ='cursor-pointer'>
                    SignOut
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar
