"use client";

import React, { useState } from 'react'
import Chat from './chat'
import Output from './output'

const page = () => {

    const [action, setAction] = useState<{category: string, value: string}[]>([]);

  return (
    <div className='flex justify-center'>
    <div className='w-1/3'></div>
    <div className='w-full'>
      <Chat setAction={setAction} />
    </div>
    <div className='w-1/3'>
    <Output action={action} />
    </div>
    </div>
  )
}

export default page
