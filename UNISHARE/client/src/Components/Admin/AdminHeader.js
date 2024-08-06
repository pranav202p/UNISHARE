import React from 'react'

export default function Header() {
  return (
    <div>
      <div className="flex flex-col mt-0 flex-1"> 
           
           <header className="bg-gray-200 border-b p-4">
               <div className="flex justify-between items-center">
                   <h1 className="text-xl text-gray-700 font-bold">Unishare</h1>
                   <div>
                       <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full mr-2 hover:bg-gray-300">
                           Sign out
                       </button>
                       <button className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full hover:bg-gray-300">
                           Settings
                       </button>
                   </div>
               </div> 
         
               </header>
           
       </div>
    </div>
  )
}
