import React from 'react'

function ItemSearch({item}) {
  return (
    <div onClick={() => {navigator.clipboard.writeText(`https://youtu.be/${item.id.videoId}`)}} className='bg-white relative rounded-lg p-2 transition-all hover:scale-105 hover:cursor-text flex lg:flex-row flex-col items-center text-left gap-3'>
      <img className="rounded w-full lg:w-32" src={item.snippet.thumbnails.high.url} alt="title" />
      <div className="">
        <p className='text font-bold'>{item.snippet.title}</p>
        <p className='text-sm italic cursor-text'>https://youtu.be/{item.id.videoId}</p>
        <p className='text-xs text-gray-500'>*Click to copy on clipboard*</p>
      </div>
    </div>
  )
}

export default ItemSearch