import Head from 'next/head'
import Sidebar from '../components/Sidebar'


export default function Home() {
  if (typeof window === 'object') {
    // Check if document is finally loaded
       document.addEventListener("DOMContentLoaded", function () {
           alert('Finished loading')
         });
      }
  return (
    <div>
      <Head>
        <title>Wizman Lite</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
    </div>
  )
}
