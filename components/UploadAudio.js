import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useRecoilState } from 'recoil';
import {audioState} from '../atoms/audioAtom'
// import { FileContext } from '../contexts/fileContext';
//import AudioWaveform from '../components/AudioWaveform'

import dynamic from 'next/dynamic'

const AudioWaveform = dynamic(() => import('../components/AudioWaveform'), {
    ssr: false
})

const UploadAudio = () => {
	const inputFile = useRef(null);
	// const { fileURL, setFileURL } = useContext(FileContext);
	const [fileURL, setFileURL] = useRecoilState(audioState);
	const [file, setFile] = useState(null);
	const history =useRouter()

	useEffect(() => {
		if (file) {
			setFileURL(file);
			//history.push('/');
		}
	}, [file, setFileURL, history]);

	const handleButtonClick = () => {
		inputFile.current.click();
	};

	const handleFileUpload = (e) => {
		// console.log(file);
		setFile(URL.createObjectURL(e.target.files[0]));
	};

	return (
		<div className='upload-audio'>
			<i
				style={{ color: '#531A65' }}
				className='material-icons audio-icon'>
				library_music
			</i>
			<h1>Upload your audio file here</h1>
			<button className='upload-btn' onClick={handleButtonClick}>
				Upload
			</button>
			<input
				type='file'
				id='file'
				ref={inputFile}
				style={{ display: 'none' }}
				accept='audio/*'
				onChange={handleFileUpload}
			/>
		
		</div>
	);
};

export default UploadAudio;
