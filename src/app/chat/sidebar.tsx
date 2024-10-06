import React from 'react'
import Logo from './logo'
import FaqIcon from './faqIcon'
const Sidebar = ({
    sideBarOpen
}: { sideBarOpen: boolean
}) => {
  return (
            <div className='h-screen relative pointer-events-none'>
            <div className="flex pt-9 items-start">
              <div className="flex items-center flex-none text-2xl">
                <div className="w-14 flex-none flex justify-center items-center">
                  <Logo
                    className='trasform scale-150'
                  />
                </div>
                Ai-ware
              </div>
            </div>
            <div className={`flex pointer-events-none w-56 max-w-56 overflow-hidden ${sideBarOpen ? "opacity-1" : "opacity-0"} transition-opacity`}>
              <div className='flex-none ps-4 pointer-events-none w-56 max-w-56 overflow-hidden'>
                <div className="flex-none mt-24">
                  <h2 className='text-3xl'>EU AI Act Compliance Checker</h2>
                </div>
                <p className="mt-4 text-sm flex-none">
                  The EU AI Act introduces new obligations to entities located within the EU and elsewhere. Use our interactive tool to determine whether or not your AI system will be subject to these.
                </p>
              </div>
            </div>
            <div className="flex mt-6 absolute bottom-9 left-0">
              <div className="w-14 flex-none flex justify-center items-center">
                <FaqIcon
                />
              </div>
            </div>
          </div>
  )
}

export default Sidebar
