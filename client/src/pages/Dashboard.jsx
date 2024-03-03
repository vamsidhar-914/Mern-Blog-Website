import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom" 
import DashSidebar from "../components/DashSidebar"
import DashProfile from "../components/DashProfile"

export default function Dashboard() {
  const location = useLocation()
  const [tab ,settab] = useState('')

  useEffect(() => {
    const urlparams = new URLSearchParams(location.search)
    const tabFromUrl = urlparams.get('tab')
    if(tabFromUrl){
      settab(tabFromUrl)
    }
  },[location.search])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* sidebar */}
        <DashSidebar />
      </div>
      
        {/* profile display */}
        {tab === 'profile' && <DashProfile />}
      
    </div>
  )
}
