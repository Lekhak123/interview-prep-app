import {useState, useRef, useEffect} from 'react';
import QuestionTimer from './QuestionTimer';
import getRandomInterruptiontime from '@/utils/GetInterruptiontime';
const MicRecorder = require('mic-recorder-to-mp3');

const QuestionWithAudio = ({
    interruptionMode,
    questionsEnded,
    startTimerAudio,
    stopquestiontimeSound,
    question,
    questionFinished,
    audioFeedbackMode,
    setaudioRecordings,
    audioRecordings,
} : any) => {
    const [isplaying,
        setisplaying] = useState(true);

    const [interruptionInQueue,
        setinterruptionInQueue] = useState(false);
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

    const audioRef = useRef < HTMLAudioElement > (null);

    const recorder = new MicRecorder({bitRate: 128});

        const [audioStopped, setaudioStopped] = useState(false);
    let buffercollected = false;
    const stopMicRecording = () => {
        // if(audioStopped){
        //     return;
        // };
        recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]:any) => {
                // do what ever you want with buffer and blob Example: Create a mp3 file and
                // play
                if(buffercollected){
                    return;
                };
                buffercollected=true;
                console.log("ended");
                let currentaudiorecordings = audioRecordings;
                let recordingobject = {question:question,buffer:buffer}

                if (audioRecordings.some((e:any) => e.question === question)) {
                    console.log("recording already exists");
                  }
                else if(currentaudiorecordings.length>0){
                    let newrecordings = [...audioRecordings,recordingobject];
                    setaudioRecordings(newrecordings)
                } else {
                    setaudioRecordings([recordingobject]);
                };
                // const file = new File(buffer, 'me-at-thevoice.mp3', {
                //     type: blob.type,
                //     lastModified: Date.now()
                // });
                // console.log(URL.createObjectURL(file));
                // setaudioStopped(false);

                // const player = new Audio(URL.createObjectURL(file));
                // player.play();

            })
            .catch((e:any) => {
                console.log(e);
            });
    }

    let pressed = false;
    const nextquestion = () => {
        if (questionsEnded) {
            return;
        };
        document.removeEventListener("keydown", (e : KeyboardEvent) => console.log(e));
        if (!pressed) {
            setisplaying(false);
        };
        pressed = true;
        if(!audioStopped){
            stopMicRecording();
        };
        
        startTimerAudio();
        // if (!pressed) {     startTimerAudio(); }; pressed = true;
    };

    const timerhasstopped = () => {
        questionFinished(question);
        stopquestiontimeSound();
        if (questionsEnded) {
            return;
        };
        if (!questionsEnded) {
            // document.addEventListener('keydown', (e : KeyboardEvent) => nextquestion(e));
        } else if (questionsEnded) {
            document.removeEventListener("keydown", (e : KeyboardEvent) => console.log(e));
        }
    };

    useEffect(() => {
        setisplaying(true);
        document.addEventListener('keydown', (e : KeyboardEvent) => {
            nextquestion();
        });
        console.log(audioStopped)
        if(!audioStopped){
            recorder
            .start()
            .then(() => {
                console.log("recording started")
            })
            .catch((e : any) => {
                console.error(e);
            });
        };
      
        return () => {
            document.removeEventListener("keydown", (e : KeyboardEvent) => console.log(e));
            // setaudioStopped(false);
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
            <audio ref={audioRef} hidden/>
        </div>

    )
}

export default QuestionWithAudio;