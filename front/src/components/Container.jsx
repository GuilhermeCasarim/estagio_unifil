import React from 'react'

export const Container = ({ children }) => {
  return (
    <div className='flex mx-auto items-center w-[80%] bg-blue-500 p-4'>{children}</div>
  )
}
