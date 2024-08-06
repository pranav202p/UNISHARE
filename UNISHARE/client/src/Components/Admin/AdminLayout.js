import React from 'react'
import Sidebar from './Sidebar'
import AdminHeader from './AdminHeader'
import{Helmet} from "react-helmet"
import { ToastContainer} from 'react-toastify';
  

const AdminLayout=({children,title,description,keywors,author})=> {
    return (
      <div>
       
                  <meta charSet="utf-8" />
                 
                  <meta name="description" content={description}/>
    <meta name="keywords" content={keywors}/>
    <meta name="author" content={author}/>
                  
                
                  <title>{title}</title>  
       
        <AdminHeader/>
        <main >
          
        
        </main>
        
        
        <Sidebar/>
        {children}
      </div>
    )
  }
  export default AdminLayout