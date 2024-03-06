import { Modal, Table , Button, Alert} from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

const DashPosts = () => {
    const { currentUser } = useSelector(state => state.user)
    const [userPosts , setuserPosts] = useState([])
    const [showMore , setShowMore] = useState(true)
    const [showModal , setshowModal] = useState(false)
    const [showError , setshowError] = useState(null)
    const [postId , setpostId] = useState(null)
  
    useEffect(() => {
        const fetchPosts = async() => {
            try{
                const res = await fetch(`/api/posts/allPosts/`) // userId = ${current._id}
                const data = await res.json()
                console.log(data.posts)
                if(res.ok){
                    setuserPosts(data.posts)
                    if(data.posts.length < 9){
                        setShowMore(false)
                    }
                }
            }catch(err){
                console.log(err.message)
            }
        }
        if(currentUser.isAdmin){
            fetchPosts()
        }
    }, [currentUser._id])

    const handleClickMore = async() => {
        const startIndex = userPosts.length
        try{
            const res = await fetch(`/api/posts/allPosts/userId=${currentUser._id}&startIndex=${startIndex}`)
            const data = await res.json()
            if(res.ok){
                setuserPosts((prev) => [...prev , ...data.posts])
                if(data.posts.length < 9){
                    setShowMore(false)
                }
            }
        }catch(err){
            console.log(err.message)
        }
    }

    const handleDeletePost = async(e) => {
        setshowModal(false)
        try{
            const res = await fetch(`/api/posts/deletePosts/${postId}/${currentUser._id}` , {
                method : 'DELETE'
            })
            const data = await res.json()
            if(!res.ok){
                setshowError(data.message)
                console.log(data.message)
            }else{
                setuserPosts((prev) => prev.filter((post) => post._id !== postId))
            }
        }catch(err){

        }
    }

  return (

    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        {/* add currenetUser.isAdmin if u want to only for admin  */}
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
        <Table hoverable className='shadow-md'>
            <Table.Head>
                <Table.HeadCell>Date Uploaded</Table.HeadCell>
                <Table.HeadCell>Post image</Table.HeadCell>
                <Table.HeadCell>Post title</Table.HeadCell>
                <Table.HeadCell>category</Table.HeadCell>
                <Table.HeadCell>delete</Table.HeadCell>
                <Table.HeadCell>
                    <span>EDIT</span>
                </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
                <Table.Body className='divide-y' key={post._id} >
                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>
                            <Link to={`/post/${post.slug}`}>
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className='w-20 h-10 object-cover bg-gray-500'
                                />
                            </Link>
                        </Table.Cell>
                        <Table.Cell>
                            <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>{post.title}</Link>
                        </Table.Cell>
                        <Table.Cell>
                            {post.category}
                        </Table.Cell>
                        <Table.Cell>
                            <span 
                            onClick={() => {
                                setshowModal(true);
                                setpostId(post._id)
                            }} 
                            className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
                        </Table.Cell>
                        <Table.Cell>
                            <Link className='text-teal-500 hover:underline' to={`/updatePost/${post._id}`}>
                                <span>Edit</span>
                            </Link>
                            
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            ))}
        </Table>
        {
            showMore && (
                <button onClick={handleClickMore} className='w-full text-teal-500 self-center texxt-sm py-7'>
                    show more
                </button>
            )
        }
        </>
      ) : (
        <p>You have no posts yet!</p>
      ) }
      <Modal show={showModal} onClose={() => setshowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you Sure you want to delete this Post</h3>
            <div className="flex justify-center gap-5">
              <Button color="failure" onClick={handleDeletePost}>Yes,Delete</Button>
              <Button color='gray' onClick={() => setshowModal(false)}>No, cancel</Button>
            </div>
            {showError && (
                <Alert className='failure'>
                {showError}
            </Alert>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashPosts
