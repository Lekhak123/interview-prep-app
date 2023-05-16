import {useState, useRef,useEffect} from 'react';
import QuestionTimer from './QuestionTimer';
import { useRecorder } from "voice-recorder-react";
import getRandomInterruptiontime from '@/utils/GetInterruptiontime';

const Question = ({
    interruptionMode,
    questionsEnded,
    startTimerAudio,
    stopquestiontimeSound,
    question,
    questionFinished
} : any) => {
    const [isplaying,
        setisplaying] = useState(true);


    const [interruptionInQueue, setinterruptionInQueue] = useState(false);
    useEffect(() => {
        if (questionsEnded) {
            return;
        };
        let timeout : any;
        if (interruptionMode && !interruptionInQueue) {
            const getinterruptiontime = async() => {
                let interruptiontime : number = await getRandomInterruptiontime();
                // let interruptiontime : number = 5000;
                setinterruptionInQueue(true);
                // console.log(`This will run after ${interruptiontime / 1000} second!`)
                timeout = setTimeout(() => {
                    // console.log("timeout triggered");
                    nextquestion();
                    setinterruptionInQueue(false);
                }, interruptiontime);
            };
            getinterruptiontime();
        };

        return () => {
            try {
                clearTimeout(timeout);
                setinterruptionInQueue(false);
            } catch (error) {
                console.log(error);
            }
        }
    }, [question]);

    const audioRef = useRef<HTMLAudioElement>(null);
    const [hasRecording, setHasRecording] = useState(false);
    const {
      time,
      data,
      stop,
      start,
      pause,
      paused,
      resume,
      recording
    } = useRecorder();


    const togglePlay = () => {
        if (audioRef.current?.paused) {
          audioRef.current?.play();
        } else {
          audioRef.current?.pause();
        }
      };
      useEffect(() => {
        console.log(recording,time,data)
      }, [time])
      

      useEffect(() => {
        if (data.url && audioRef.current) {
          audioRef.current.src = data.url;
        }
      }, [data.url]);
      let pressed = true;

    const nextquestion = () => {
        if (questionsEnded) {
            return;
        };
        if (recording) {
            stop();
            setHasRecording(true);
            console.log( audioRef.current?.src);
          };
          document.removeEventListener("keydown", (e : KeyboardEvent) => console.log(e));
          if(pressed){
              setisplaying(false);
          };
          pressed=false;
        startTimerAudio();
        // if (!pressed) {     startTimerAudio(); }; pressed = true;
    };

    const timerhasstopped = () => {
        if (questionsEnded) {
            return;
        };
        questionFinished(question);
        stopquestiontimeSound();
        if (!questionsEnded) {
            // document.addEventListener('keydown', (e : KeyboardEvent) => nextquestion(e));
        } else if (questionsEnded) {
            document.removeEventListener("keydown", (e : KeyboardEvent) => console.log(e));
        }
    };

    useEffect(() => {

            if(!recording && !hasRecording){
                start();
                console.log("recording has started")
                setHasRecording(false);
            }

        setisplaying(true);
        document.addEventListener('keydown', (e : KeyboardEvent) => {
            if(isplaying){

                nextquestion();
            }
        });

        return () => {
        
            document.removeEventListener("keydown", (e : KeyboardEvent) => console.log(e));
        };

    }, [question]);

    return (

        <div className="questionContainer">

            {isplaying && <div
                className="questiontextwrapper d-flex justify-centent-center align-items-center">

                <div
                    className=' d-flex justify-right align-items-center text-center m-auto mb-4 text-sm'>
                    Press any key to stop.

                </div>
                <div
                    className="mb-3 underline decoration-solid decoration-pink-500 hover:decoration-wavy questioncontain text-3xl  font-bold capitalize antialiased text-rose-600 hover:text-emerald-600">
                    {question}
                </div>
            </div>
}
            <div className="questiontimer d-flex justify-center m-3">

                {!isplaying && <QuestionTimer timerhasstopped={timerhasstopped}/>}
            </div>
            <audio ref={audioRef} hidden />
        </div>

    )
}

export default Question;