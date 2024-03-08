import { Button, Select, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard'

const SearchPage = () => {
    const [sidebarData , setSidebarData] = useState({
        searchTerm : '',
        sort: 'desc',
        category:'uncategorized'
    })
    const [posts , setposts] = useState([])
    const [loading , setloading] = useState(false)
    const [showmore , setshowmore] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    

    useEffect(() => {
        const urlparams = new URLSearchParams(location.search)
        const searchTermfromUrl = urlparams.get('searchTerm')
        const sortFromUrl = urlparams.get('sort')
        const categoryfromurl = urlparams.get('category')
        if(searchTermfromUrl || sortFromUrl || categoryfromurl){
            setSidebarData({
                ...sidebarData,
                searchTerm : searchTermfromUrl,
                sort : sortFromUrl,
                category : categoryfromurl
            })
        }

        const fetchPosts = async(e) => {
            setloading(true)
            const searchQuery = urlparams.toString()
            const res = await fetch(`/api/posts/allPosts?${searchQuery}`)
            if(!res.ok){
                setloading(false)
                return
            }
            if(res.ok){
                const data = await res.json()
                setposts(data.posts)
                setloading(false)
                if(data.posts.length === 9){
                    setshowmore(true)
                }else{
                    setshowmore(false)
                }
            }
        }
        fetchPosts()
    },[location.search])

    const handleChange = (e) => {
        if(e.target.id === 'searchTerm'){
            setSidebarData({...sidebarData , searchTerm : e.target.value})
        }
        if(e.target.id === 'sort'){
            const order = e.target.value || 'desc'
            setSidebarData({...sidebarData  ,sort:order})
        }
        if(e.target.id === 'category'){
            const category = e.target.value || 'uncategorized'
            setSidebarData({...sidebarData , category})
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlparams= new URLSearchParams(location.search)
        urlparams.set('searchTerm',sidebarData.searchTerm)
        urlparams.set('sort' , sidebarData.sort)
        urlparams.set('category' , sidebarData.category)
        const searchQuery = urlparams.toString()
        navigate(`/search?${searchQuery}`)
    }

    // function for show more
    const handleShowMore = async (e) => {
        const numberofPosts = posts.length
        const startIndex = numberofPosts
        const urlparams = new URLSearchParams(location.search)
        urlparams.set('startIndex' , startIndex)
        const searchQuery = urlparams.toString()
        const res = await fetch(`/api/posts/allPosts?${searchQuery}`)
        if(!res.ok){
            return;
        }
        if(res.ok){
            const data = await res.json()
            setposts([...posts , ...data.posts])
            if(data.posts.length === 9){
                setshowmore(true)
            }else{
                setshowmore(false)
            }
        }
    }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
            <div className='flex items-center gap-2'>
                <label className='whitespace-nowrap font-semibold'>Search Term : </label>
                <TextInput placeholder='search...' id='searchTerm' type='text' value={sidebarData.searchTerm} onChange={handleChange}/>
            </div>
            <div className='flex items-center gap-16'>
                <label className='whitespace-nowrap font-semibold'>Sort :</label>
                <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
                    <option value='desc'>Latest</option>
                    <option value="asc">Oldest</option>
                </Select>
            </div>
            <div className='flex items-center gap-8'>
                <label className='whitespace-nowrap font-semibold'>category :</label>
                <Select onChange={handleChange} value={sidebarData.category} id='category'>
                    <option value='uncategorized'>uncategorized</option>
                    <option value="art">Art</option>
                    <option value="music">Music</option>
                    <option value="cinema">Cinema</option>
                </Select>
            </div>
            <Button type='submit' outline gradientDuoTone='purpleToPink'>
                Search
            </Button>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Posts results</h1>
        <div className='p-7 flex flex-wrap gap-4'>
            {
                !loading && posts.length === 0 && (
                    <p className='text-3xl text-gray-500'>No Posts Found</p>
                )
            }
            {
                loading && (
                    <p className='text-xl text-gray-500'>Loading...</p>
                )
            }
            {
                !loading && posts && posts.map((post) => (
                    <PostCard key={post._id} post={post}/>
                ))
            }
            {
                showmore && <button onClick={handleShowMore} className='text-teal-500 text-lg hover:underline p-7 w-full'>

                </button>
            }
        </div>
      </div>
    </div>
  )
}

export default SearchPage
