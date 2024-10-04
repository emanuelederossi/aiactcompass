import Link from 'next/link'
import React from 'react'

const Admin = () => {
  return (
    <div className='bg-slate-700 min-w-full min-h-screen flex justify-center items-center'>
      <div className="p-5 rounded-xl bg-slate-600">
        <Link className='block text-white underline text-3xl mb-4' href="/categorie">Categories</Link>
        <Link className='block text-white underline text-3xl' href="/domande">Questions</Link>
      </div>
    </div>
  )
}

export default Admin
