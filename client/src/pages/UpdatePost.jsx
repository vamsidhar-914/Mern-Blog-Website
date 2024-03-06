import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { storage } from "../firebase"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom"

const UpdatePost = () => {
    const { currentUser } = useSelector(state => state.user)
    const [file , setfile] = useState(null)
    const [imageUploadError , setimageUploadError] = useState(null)
    const [imageUploadProgress ,setimageUploadProgress] = useState(null)
    const [formdata , setformdata ] = useState([])
    const [publishError , setpublishError] = useState(null)
    const { postId } = useParams()
    const navigate = useNavigate()
   
    useEffect(() => {
       
        try{  
            const fetchData = async() => {
                const res = await fetch(`/api/posts/allPosts/?=${postId}`)
            const data = await res.json()
            if(!res.ok){
                console.log(data.message)
                setpublishError(data.message)
                return;
            }
            if(res.ok){
                setpublishError(null)
                setformdata(data.posts[0])
            }
            }  
            fetchData()
        }catch(err){
            console.log(err.message)
        }
       
    },[postId])


    const handleUploadImage = async(e) =>{
        try{
            if(!file){
                setimageUploadError("please select an image")
                return;
            }
            setimageUploadError(null)
            const name = new Date().getTime() + file.name
            const storageRef =ref(storage , name)
            const uploadTask = uploadBytesResumable(storageRef , file)
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress = 
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setimageUploadProgress(progress.toFixed(0))
                console.log("upload is" + progress + "% done")
                switch(snapshot.state){
                  case "paused":
                    console.log('upload is paused');
                    break;
                  case "running":
                    console.log("upload is running");
                    break;
                  default:
                    break;
                }
              },
              (error) => {
                setimageUploadError("image upload Failed")
                setimageUploadProgress(null)
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setimageUploadError(null)
                    setimageUploadProgress(null)
                    setformdata((prev) => ({...prev ,image : downloadURL }))
                })
              }
            )
        }catch(err){
            setimageUploadError("image uplaod error")
            setimageUploadProgress(null)
        }
    }

    const handleSubmit = async(e) => {
      e.preventDefault()
      try{
        const res = await fetch(`/api/posts/updatePost/${postId}/${currentUser._id}` , {
          method : "PUT",
          headers : {
            'Content-Type' : 'application/json',
          },
          body : JSON.stringify(formdata)
        })
        const data = await res.json()
        if(!res.ok){
          setpublishError(data.message)
          console.log(data.message)
          return
        }
        if(res.ok){
          setpublishError(null)
          navigate(`/post/${data.slug}`)
        }
      }catch(err){
        setpublishError('Something Went Wrong')
      }
    }


  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Update Post</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type='text' placeholder='Title' required id='title' className='flex-1' onChange={(e) => setformdata({...formdata , title : e.target.value})} value={formdata.title} />
                <Select onChange={(e) => setformdata({...formdata , category : e.target.value })} value={formdata.category}>
                    <option value="uncategorized">Select a category</option>
                    <option value='art'>Art</option>
                    <option value='music'>music</option>
                    <option value='cinema'>cinema</option>
                </Select>
            </div>
            <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                <FileInput type="file" accept='image/*' onChange={(e) => setfile(e.target.files[0])} />
                <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage} disabled={imageUploadProgress}>Upload Image</Button>
            </div>
            {imageUploadError && (
              <Alert color='failure'>
                {imageUploadError}
              </Alert>
            )}
            {formdata.image && (
              <img 
                src={formdata.image}
                alt='upload'
                className='w-full h-72 object-cover'
              />
            )}
            <ReactQuill theme='snow' value={formdata.content} placeholder='Write Something...' className='h-72 mb-12' required onChange={(value) => setformdata({...formdata , content : value})}  />
            <Button type='submit' gradientDuoTone='purpleToPink'>Update Post</Button>
            {
              publishError && (
                <Alert className='mt-5' color="failure">
                  {publishError}
                </Alert>
              )
            }
        </form>
    </div>
  )
}

export default UpdatePost
