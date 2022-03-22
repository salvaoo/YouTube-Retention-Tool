import React from 'react'

function ItemSearch({item}) {
  return (
    <div className='bg-white relative rounded-lg p-2 transition-all hover:scale-105 hover:cursor-pointer flex items-center text-left gap-3'>
      <img className="rounded" src={item.snippet.thumbnails.default.url} alt="title" />
      <div className="">
        <p className='text font-bold'>{item.snippet.title}</p>
        <p className='text-sm italic cursor-text'>https://youtu.be/{item.id.videoId}</p>
        <p className='text-xs text-gray-500'>*copy the link on the input*</p>
      </div>
    </div>
  )
}

export default ItemSearch