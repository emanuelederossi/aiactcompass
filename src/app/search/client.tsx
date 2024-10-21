"use client"

import Link from 'next/link'
import React from 'react'

const Client = ({
    dati
}: { 
    dati: { url: string, match: string }[]
}) => {
    console.log(dati);
  return (
      <div
      className='w-full h-full'
    >
      {
                dati.map((dato, i) => (
                    <div key={`${dato.url}-${i}`} className='w-full h-full p-6'>
                        <div className="rounded bg-gray-200 border border-gray-500 w-full">
                            <div className="text-blue-500">
                                <Link target='_blank' href={dato.url}>{dato.url}</Link>
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: dato.match }}></div>
                        </div>
                    </div>
                ))
            }
    </div>
  )
}

export default Client
