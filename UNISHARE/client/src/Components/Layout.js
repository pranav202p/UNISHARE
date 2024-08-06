import React from 'react'
import Footer from './Footer'
import Header from './Header'
import{Helmet} from "react-helmet"
import { ToastContainer} from 'react-toastify';
  
  import 'react-toastify/dist/ReactToastify.css';

  

const Layout=({children,title,description,keywors,author})=> {
  return (
    <div>
      <Helmet>
                <meta charSet="utf-8" />
               
                <meta name="description" content={description}/>
  <meta name="keywords" content={keywors}/>
  <meta name="author" content={author}/>
                
              
                <title>{title}</title>  
            </Helmet>
      <Header/>
      <main >
        <ToastContainer/>
      {children}
      </main>
      <Footer/>
    </div>
  )
}
export default Layout