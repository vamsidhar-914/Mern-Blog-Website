import { Alert, Button, Modal, TextInput } from "flowbite-react"
import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { storage } from "../firebase"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { updateStart , updateFailure,updateSucces , deleteUserFailure,deleteUserStart,deleteUserSuccess , logoutSuccess } from "../redux/userSlice"
import { useDispatch } from "react-redux"
import { HiOutlineExclamationCircle } from "react-icons/hi"


const DashProfile = () => {
    const { currentUser  , error , loading} = useSelector(state => state.user)
    const [imageFile , setImageFile] = useState(null)
    const [imageURL , setimageURL] = useState(null)
    const [uploadProgress , setuplaodProgress ] = useState(null)
    const [uplaodError , setuploadError] = useState(null)
    const [imageFileUploading , setimageFileUplaoding] = useState(null)
    const [updateSuccess , setupdateSuccess] = useState(null)
    const [updateError , setupdateError] = useState(null)
    const [showModal , setshowModel] = useState(false)
    const [formdata , setformdata] = useState([])
    const dispatch = useDispatch()
    const filepickerRef = useRef()

    const handleImageChange = (e) => {
      const file = e.target.files[0]
      if(file) {
        setImageFile(file)
        setimageURL(URL.createObjectURL(file))
      }
    }

    useEffect(() => {
      const uploadimage = () => {
        setimageFileUplaoding(true);
        setuploadError(null)
        const name = new Date().getTime() + imageFile.name
        const storageRef =ref(storage , name)
        const uploadTask = uploadBytesResumable(storageRef , imageFile)
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = 
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
            setuploadError(error)
            setimageFileUplaoding(false)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setformdata((prev) => ({...prev ,profilePicture : downloadURL }))
              setimageFileUplaoding(false)
            })
          }
        )
      }
      imageFile && uploadimage()
    },[imageFile])


    // uploading image using firebase

    // const uploadImage = async() => {
    //     // servic firebase.storage
    //     // service firebase.storage {
    //     //   match /b/{bucket}/o {
    //     //     match /{allPaths=**} {
    //     //       allow read ;
    //     //       allow write : if
    //     //       request.resource.size < 2 * 1024 * 1024 &&
    //     //       request.resource.contentType.matches('image/.*')
    //     //     }
    //     //   }
    //     // }
    //     const storage = getStorage(app)
    //     const fileName= new Date().getTime() +imageFile.name
    //     const storgeRef = ref(storage , fileName)
    //     const uploadTask = uploadBytesResumable(storgeRef,imageFile)
    //     uploadTask.on(
    //       'state_changed',
    //       (snapshot) => {
    //         const progress = 
    //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //         setuplaodProgress(progress.toFixed(0))
    //       },
    //       (error) => {
    //         setuploadError(error)
    //       },
    //       () => {
    //         getDownloadURL(uploadTask.snapshot.ref).then((downlaodURL) => {
    //           setimageURL(downlaodURL)
    //           setformdata({...formdata ,profilePicture : downlaodURL })
    //         })
    //       }
    //     )
    // }


    const handleFormChange = (e) => {
      setformdata({...formdata , [e.target.id] : e.target.value})
    }
    console.log(formdata)
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      if(Object.keys(formdata).length === 0){
        setupdateError("No changes made")
        return;
      }
      if(imageFileUploading) {
      setupdateError("please wait for image to be uploaded")
      return
      }
      try{
        dispatch(updateStart())
        const res = await fetch(`/api/users/update/${currentUser._id}` , {
          method : 'PUT',
          headers : {
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify(formdata)
        })
        const data = await res.json()
        if(!res.ok){
          dispatch(updateFailure(data.message))
          setupdateError(data.message)
        }else{
          dispatch(updateSucces(data))
          setupdateSuccess("account updated Succesfully")
        }
      }catch(error){
        dispatch(updateFailure(error.message))
        setupdateError(error.nessage)
      }
    }

    const handleDeleteUser = async() => {
      setshowModel(false)
      try{
        dispatch(deleteUserStart())
        const res = await fetch(`/api/users/delete/${currentUser._id}` ,{
          method : 'DELETE'
        })
        const data = await res.json()
        if(!res.ok){
          dispatch(deleteUserFailure(data.message))
        }else{
          dispatch(deleteUserSuccess(data))
        }
      }catch(error){
        dispatch(deleteUserFailure(error.message))
      }
    }

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
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className="my-7 text-center font-semibold text-3xl">profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleImageChange} ref={filepickerRef} hidden />
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={()=>filepickerRef.current.click()}>
        <img src={imageURL || currentUser.profilePicture} alt="user" className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"/>
        </div>
        {uplaodError && (
          <Alert color='failure'> 
          {uplaodError}
        </Alert>
        )}
        <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.username} onChange={handleFormChange} />
        <TextInput type="email" id="email" placeholder="email" defaultValue={currentUser.email}  onChange={handleFormChange}/>
        <TextInput type="password" id="password" placeholder="password"  onChange={handleFormChange}/>
        <Button type="submit" gradientDuoTone='purpleToPink' outline disabled={loading || imageFileUploading}>
          {loading ? "loading..." : "update"}
        </Button>
        <Link to="/create-post">
        <Button type="button" gradientDuoTone="purpleToPink" className="w-full">
          {currentUser.isAdmin ? (
            <span>Create Posts</span>
          ) : (
            <span>create Your Posts</span>
          )}
        </Button>
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={() => setshowModel(true)} className="text-red-500 cursor-pointer">Delete Account</span>
        <span onClick={handleLogout} className="text-red-500 cursor-pointer">Sign Out</span>
      </div>
      {updateSuccess && (
        <Alert color='success' className="mt-5">
          {updateSuccess}
        </Alert>
      )}
      {updateError && (
        <Alert color="failure" className="mt-5">
          {updateError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal show={showModal} onClose={() => setshowModel(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you Sure you want to delete this account</h3>
            <div className="flex justify-center gap-5">
              <Button color="failure" onClick={handleDeleteUser}>Yes,Delete</Button>
              <Button color='gray' onClick={() => setshowModel(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashProfile
