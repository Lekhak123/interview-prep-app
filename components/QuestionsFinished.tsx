import React, {useEffect,useRef} from 'react'
import ReactAudioPlayer from 'react-audio-player';

function QuestionsFinished({questionsArray,volume} : any) {

    const audioref = useRef(volume);
    const firstaudioref = useRef(volume);
    useEffect(() => {
        try {
            if(volume){
                audioref.current.volume=volume;
                firstaudioref.current.volume=volume;
            }
        } catch (error) {
            console.log(error);
        };
    }, [volume])
    const setPlayBack = () => {
        try {
            firstaudioref.current.playbackRate = 1.5;
        } catch (error) {
            console.log(error);
        };
      };
    return (
        <div className='mt-8 '>
                {questionsArray.map((e : any,index:any) => {
                    if(index===0){
                        return (
                            <div key={index} className="card w-auto text-center d-flex justify-center  bg-transparent shadow-xl">
                            <div className="card-body mt-5">
                                <h2 className="card-title text-center text-cyan-500 text-base d-flex justify-center">{e
                                        ?.question}</h2>
                                <div className="card-actions justify-center">
                                    <ReactAudioPlayer   onCanPlay={() => setPlayBack()}  ref={firstaudioref} controls id={e?.question} autoPlay={false}  volume={volume} src={URL.createObjectURL(e?.file)} // other props here
                                    />
                                </div>
                            </div>
                </div>
                        )
                    } else {

                        return (
                                <div key={index} className="card w-auto text-center d-flex justify-center  bg-transparent shadow-xl">
                            <div className="card-body mt-5">
                                <h2 className="card-title text-center text-cyan-500 text-base d-flex justify-center">{e
                                        ?.question}</h2>
                                <div className="card-actions justify-center">
                                    <ReactAudioPlayer  ref={audioref} controls id={e?.question} autoPlay={false}  volume={volume} src={URL.createObjectURL(e?.file)} // other props here
                                    />
                                </div>
                            </div>
                </div>
                        )
                    }
                })}

        </div>
    )
}

export default QuestionsFinished