import { FcLike } from 'react-icons/fc'

function Footer() {
  return (
    <footer className="relative bg-black text-white py-5 flex gap-3 justify-center items-center">
      <p className="text-sm">Site created by <a className='text-red-200' href="https://salvagr.com" target="_blank" rel="noreferrer">salvagr.com</a></p>
      <FcLike />
    </footer>
  )
}

export default Footer