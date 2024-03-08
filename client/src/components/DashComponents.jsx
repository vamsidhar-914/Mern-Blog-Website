import { Modal, Table , Button} from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaCheck , FaTimes} from 'react-icons/fa'

const DashComponents = () => {
    const { currentUser } = useSelector(state => state.user)
    const [comments , setcomments] = useState([])
    const [showMore , setShowMore] = useState(true)
    const [showModal , setshowModal] = useState(false)
    const [commentIdtoDelete , setcommentIdtoDelete] = useState('')

    useEffect(() => {
        const fetchcomments = async() => {
            try{
                const res = await fetch('/api/comments/getComments')
                const data = await res.json()
                console.log(res)
                if(res.ok){
                    setcomments(data.comments)
                    if(data.comments.length < 9){
                        setShowMore(false)
                    }
                }
            }catch(err){
                console.log(err)
            }
        }
        if(currentUser.isAdmin){
            fetchcomments()
        }
    }, [currentUser._id])

    const handleClickMore = async() => {
        const startIndex = comments.length
        try{
            const res = await fetch(`/api/comments/getComments/?startIndex=${startIndex}`)
            const data = await res.json()
            if(res.ok){
                setusers((prev) => [...prev , ...data.comments])
                if(data.comments.length < 9){
                    setShowMore(false)
                }
            }
        }catch(err){
            console.log(err.message)
        }
    }

    const handleDeletecomment = async(e) => {
        setshowModal(false)
        try{
            const res = await fetch(`/api/comments/deleteComment/${commentIdtoDelete}` , {
                method : 'DELETE'
            })
            const data = await res.json()
            if(!res.ok){
                console.log(data.message)
            }else{
                setcomments((prev) => prev.filter((comment) => comment._id !== commentIdtoDelete))
                setshowModal(false)
            }
        }catch(err){

        } 
    }

  return (

    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
        <Table hoverable className='shadow-md'>
            <Table.Head>
                <Table.HeadCell>Date Created</Table.HeadCell>
                <Table.HeadCell>comment content</Table.HeadCell>
                <Table.HeadCell>Number of likes</Table.HeadCell>
                <Table.HeadCell>PostId</Table.HeadCell>
                <Table.HeadCell>userId</Table.HeadCell>
                <Table.HeadCell>delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
                <Table.Body className='divide-y' key={comment._id} >
                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell>{new Date(comment.createdAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>
                            {/* <Link to={`/comment/${comment.slug}`}> */}
                               {comment.content} 
                            {/* </Link> */}
                        </Table.Cell>
                        <Table.Cell>
                            {comment.numberOfLikes}
                        </Table.Cell>
                        <Table.Cell>
                            {comment.postId}
                        </Table.Cell>
                        <Table.Cell>
                            {comment.userId}
                        </Table.Cell>
                        <Table.Cell>
                            <span 
                            onClick={() => {
                                setshowModal(true);
                                setcommentIdtoDelete(comment._id)
                            }} 
                            className='font-medium text-red-500 hover:underline cursor-pointer'>Delete</span>
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
        <p>No Comments to display!</p>
      ) }
      <Modal show={showModal} onClose={() => setshowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you Sure you want to delete this comment</h3>
            <div className="flex justify-center gap-5">
              <Button color="failure" onClick={handleDeletecomment}>Yes,Delete</Button>
              <Button color='gray' onClick={() => setshowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashComponents
