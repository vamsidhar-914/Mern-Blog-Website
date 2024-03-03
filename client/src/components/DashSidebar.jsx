import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { HiArrowSmRight, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'

const DashSidebar = () => {
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
            <Sidebar.ItemGroup>
                <Link to="/dashboard/?tab=profile">
                <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={'user'} labelColor ='dark' as='button'>
                    profile
                </Sidebar.Item>
                </Link>
                <Sidebar.Item  icon={HiArrowSmRight} className ='cursor-pointer'>
                    SignOut
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar
