import React, { useState, useEffect,  useRef } from 'react';
import {audioState} from '../atoms/audioAtom'

import {BsFillPlayFill,BsPauseFill,BsVolumeMute} from 'react-icons/bs'
import {AiFillStepForward,AiFillStepBackward,AiFillSound} from 'react-icons/ai'
import {MdOutlineReplay} from 'react-icons/md'



import wavesurfer from 'wavesurfer.js';

import { useRecoilState } from 'recoil';

const AudioWaveform = () => {
	const wavesurferRef = useRef(null);
	const timelineRef = useRef(null);

	const [volumeVisibility, setvolumeVisibility] = useState(false)

	// fetch file url from the context

const [fileURL, setFileURL] = useRecoilState(audioState);

	// crate an instance of the wavesurfer
	const [wavesurferObj, setWavesurferObj] = useState();

	const [playing, setPlaying] = useState(true); // to keep track whether audio is currently playing or not
	const [volume, setVolume] = useState(1); // to control volume level of the audio. 0-mute, 1-max
	const [zoom, setZoom] = useState(1); // to control the zoom level of the waveform
	const [duration, setDuration] = useState(0); // duration is used to set the default region of selection for trimming the audio
const [currentTime, setCurrentTime] = useState(0)
const [totalTime, setTotalTime] = useState(0)

var formatTime = function (time) {
    return [
        Math.floor((time % 3600) / 60), // minutes
        ('00' + Math.floor(time % 60)).slice(-2) // seconds
    ].join(':');
}; 
	// create the waveform inside the correct component
	useEffect(() => {
		if (wavesurferRef.current && !wavesurferObj) {
			setWavesurferObj(
				wavesurfer.create({
					container: '#waveform',
					scrollParent: false,
					autoCenter: true,
					cursorColor: 'red',
					cursorWidth:0,
					loopSelection: true,
					waveColor: '#2F4F4F',
					progressColor: '#00FFFF',
					responsive: true,
					barHeight:1,
					height:50,
					barGap:1,
					barRadius:1,
					fillParent:true,
				})
			);
		}
	}, [wavesurferRef, wavesurferObj]);

	// once the file URL is ready, load the file to produce the waveform
	useEffect(() => {
		if (fileURL && wavesurferObj) {
			wavesurferObj.load(fileURL);
		}
	}, [fileURL, wavesurferObj]);

	useEffect(() => {
		if (wavesurferObj) {
			// once the waveform is ready, play the audio
			wavesurferObj.on('ready', () => {
				wavesurferObj.play();
				wavesurferObj.enableDragSelection({}); // to select the region to be trimmed
				setDuration(Math.floor(wavesurferObj.getDuration())); // set the duration in local state
			});

			// once audio starts playing, set the state variable to true
			wavesurferObj.on('play', () => {
				setPlaying(true);
			});

			// once audio starts playing, set the state variable to false
			wavesurferObj.on('finish', () => {
				setPlaying(false);
			});

			// if multiple regions are created, then remove all the previous regions so that only 1 is present at any given time
			wavesurferObj.on('region-updated', (region) => {
				const regions = region.wavesurfer.regions.list;
				const keys = Object.keys(regions);
				if (keys.length > 1) {
					regions[keys[0]].remove();
				}
			});

			wavesurferObj.on('audioprocess', function() {
				if (wavesurferObj.isPlaying()) {
				  let totalTime = wavesurferObj.getDuration();
					 let  currentTime = wavesurferObj.getCurrentTime();
					let  remainingTime = totalTime - currentTime;

					setCurrentTime(Math.trunc(currentTime))
					setTotalTime(Math.trunc(totalTime))
					  
				
				}
			  });
		}
	}, [wavesurferObj]);

	// set volume of the wavesurfer object, whenever volume variable in state is changed
	useEffect(() => {
		if (wavesurferObj) wavesurferObj.setVolume(volume);
	}, [volume, wavesurferObj]);

	// set zoom level of the wavesurfer object, whenever the zoom variable in state is changed
	useEffect(() => {
		if (wavesurferObj) wavesurferObj.zoom(zoom);
	}, [zoom, wavesurferObj]);

	// when the duration of the audio is available, set the length of the region depending on it, so as to not exceed the total lenght of the audio
	useEffect(() => {
		if (duration && wavesurferObj) {
			// add a region with default length
			wavesurferObj.addRegion({
				start: Math.floor(duration / 2) - Math.floor(duration) / 5, // time in seconds
				end: Math.floor(duration / 2), // time in seconds
				color: 'hsla(265, 100%, 86%, 0.4)', // color of the selected region, light hue of purple
			});
		}
	}, [duration, wavesurferObj]);



	const handlePlayPause = (e) => {
		wavesurferObj.playPause();
		setPlaying(!playing);
	};

	const handleReload = (e) => {
		// stop will return the audio to 0s, then play it again
		wavesurferObj.stop();
		wavesurferObj.play();
		setPlaying(true); // to toggle the play/pause button icon
	};

	const handleVolumeSlider = (e) => {
		setVolume(e.target.value);
	};

	const handleZoomSlider = (e) => {
		setZoom(e.target.value);
	};




function time_convert(num)
 { 
  var hours = Math.floor(num / 60);  
  var minutes = num % 60;
  return hours + ":" + minutes;         
}
	

	return (
		<section className='flex h-20 w-screen bg-black text-white items-center '>
			
			<div className=' w-3/4 flex items-center ' >
				<div className='w-1/5 flex  justify-around items-center '>
					<button><AiFillStepBackward className='hover:text-yellow-600 hover:transition-all duration-300'/></button>
				<button
						title='play/pause'
						className='bg-white rounded-full text-black '
						onClick={handlePlayPause}>
						{playing ? (
							<BsPauseFill className='h-10 w-10 hover:text-yellow-600 hover:transition-all duration-300'/>
						) : (
							<BsFillPlayFill className='h-10 w-10 hover:text-yellow-600 hover:transition-all duration-300'/>
						)}
					</button>
					<button><AiFillStepForward className='hover:text-yellow-600 hover:transition-all duration-300'/></button>
					<button
						title='reload'
						className='controls'
						onClick={handleReload}>
						<MdOutlineReplay className='hover:text-yellow-600 hover:transition-all duration-300'/>
					</button>
					<div className='w-7'>
					<span className='text-sm'>{time_convert(currentTime)}</span>
					</div>
					
				</div>
				<div ref={wavesurferRef} className='w-4/5' id='waveform'  />
				<div ref={timelineRef} id='wave-timeline' />
			</div>
			<div className='w-1/4 flex space-x-3 items-center'>
			<div className='p-2 w-7'>
				<span className='text-sm'>{time_convert(totalTime)}</span>
			</div>
			
			
				
				
					
					<div className='text-white flex pl-3'>
					{volume > 0 ? (
							<AiFillSound className='transition-all duration-300 hover:text-yellow-600 hover:transition-all ' onMouseEnter={()=>setvolumeVisibility(true)} onMouseLeave={()=>setvolumeVisibility(false)} />
						) : (
							<BsVolumeMute className='transition-all duration-300 hover:text-yellow-600 hover:transition-all ' onMouseEnter={()=>setvolumeVisibility(true)} onMouseLeave={()=>setvolumeVisibility(false)}/>
						)}
					{ volumeVisibility &&	<input
					onMouseEnter={()=>setvolumeVisibility(true)}
					onMouseLeave={()=>setvolumeVisibility(false)}
					
							type='range'
							min='0'
							max='1'
							step='0.05'
							value={volume}
							onChange={handleVolumeSlider}
							className='transition-all duration-300'
						/>}
					</div>
				
			
			</div>
			
		</section>
	);
};

export default AudioWaveform;
