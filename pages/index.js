
import Head from 'next/head'
import Image from 'next/image'
import UploadAudio from '../components/UploadAudio'
//import AudioWaveform from '../components/AudioWaveform'
import dynamic from 'next/dynamic'
import { useRecoilState } from 'recoil'
import { audioState } from '../atoms/audioAtom'

const AudioWaveform = dynamic(() => import('../components/AudioWaveform'), {
    ssr: false
})

const Home= () => {
  const [fileURL, setFileURL] = useRecoilState(audioState);
  return (
    <div className="flex w-screen h-screen flex-col  ">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
<div className='h-auto'>
<UploadAudio />
</div>
<div className='h-16 absolute bottom-0 '>
<AudioWaveform />
</div>
      
     
    </div>
  )
}

export default Home
