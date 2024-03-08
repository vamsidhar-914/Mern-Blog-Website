import { BrowserRouter , Routes ,Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Signin from "./pages/Signin"
import Singup from "./pages/Singup"
import Dashboard from "./pages/Dashboard"
import Header from "./components/Header"
import Projects from "./pages/Projects"
import Footer from "./components/Footer"
import ProtectedRoutes from "./components/ProtectedRoutes"
import CreatePosts from "./pages/CreatePosts"
import PostPage from "./pages/PostPage"
import UpdatePost from "./pages/UpdatePost"
import ScrolltoTop from "./components/ScrolltoTop"
import SearchPage from "./pages/SearchPage"

export default function App() {
  return (
    <BrowserRouter>
    <ScrolltoTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/login" element={<Signin />}/>
        <Route path="/register" element={<Singup />}/>
        <Route path="/search" element={<SearchPage />}/>
        <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/create-post" element={<CreatePosts />}/>
            <Route path="/updatePost/:postId" element={<UpdatePost />}/>
        </Route>
        <Route path="/project" element={<Projects />}/>
        <Route path="/post/:postSlug" element={<PostPage />}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
