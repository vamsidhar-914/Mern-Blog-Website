import { Modal, Table , Button} from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaCheck , FaTimes} from 'react-icons/fa'

const DashUsers = () => {
    const { currentUser } = useSelector(state => state.user)
    const [users , setusers] = useState([])
    const [showMore , setShowMore] = useState(true)
    const [showModal , setshowModal] = useState(false)
    const [userIdToDelete , setuserIdToDelete] = useState(null)
    
    console.log(users)


    useEffect(() => {
        const fetchUsers = async() => {
            try{
                const res = await fetch('/api/users/getallUsers')
                const data = await res.json()
                console.log(res)
                if(res.ok){
                    setusers(data.users)
                    if(data.users.length < 9){
                        setShowMore(false)
                    }
                }
            }catch(err){
                console.log(err)
            }
        }  
        if(currentUser.isAdmin){
            fetchUsers()
        }
    }, [currentUser._id])

    const handleClickMore = async() => {
        const startIndex = users.length
        try{
            const res = await fetch(`/api/users/getallUsers/?startIndex=${startIndex}`)
            const data = await res.json()
            if(res.ok){
                setusers((prev) => [...prev , ...data.users])
                if(data.users.length < 9){
                    setShowMore(false)
                }
            }
        }catch(err){
            console.log(err.message)
        }
    }

    const handleDeleteUser = async(e) => {
        setshowModal(false)
        try{
            const res = await fetch(`/api/users/delete/${userIdToDelete}` , {
                method : 'DELETE'
            })
            const data = await res.json()
            if(!res.ok){
                console.log(data.message)
            }else{
                setusers((prev) => prev.filter((user) => user._id !== userIdToDelete))
                setshowModal(false)
            }
        }catch(err){

        } 
    }

  return (

    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
        <Table hoverable className='shadow-md'>
            <Table.Head>
                <Table.HeadCell>Date Created</Table.HeadCell>
                <Table.HeadCell>User image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>email</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
                <Table.HeadCell>delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
                <Table.Body className='divide-y' key={user._id} >
                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>
                            {/* <Link to={`/user/${user.slug}`}> */}
                                <img
                                    src={user.profilePicture}
                                    alt={user.title}
                                    className='w-10 h-10 object-cover rounded-full  bg-gray-500'
                                />
                            {/* </Link> */}
                        </Table.Cell>
                        <Table.Cell>
                            {user.username}
                        </Table.Cell>
                        <Table.Cell>
                            {user.email}
                        </Table.Cell>
                        <Table.Cell>
                            {user.isAdmin ? (<FaCheck className="text-green-500" />) : (<FaTimes className='text-red-500'  />)}
                        </Table.Cell>
                        <Table.Cell>
                            <span 
                            onClick={() => {
                                setshowModal(true);
                                setuserIdToDelete(user._id)
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
        <p>No users to display!</p>
      ) }
      <Modal show={showModal} onClose={() => setshowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you Sure you want to delete this User</h3>
            <div className="flex justify-center gap-5">
              <Button color="failure" onClick={handleDeleteUser}>Yes,Delete</Button>
              <Button color='gray' onClick={() => setshowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashUsers
