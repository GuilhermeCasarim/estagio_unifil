import React from 'react'

export const Container = ({ children }) => {
  return (
    <div className='flex mx-auto w-[80%] bg-white min-h-[100vh]'>{children}</div>
  )
}

//w-full no container
