"use client";
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
    toasterror,
    randomVoice
} : any) => {
    const [isplaying,
        setisplaying] = useState(true);


    let interruptionaudio = new Audio("/sounds/beep.mp3");

    const playinterruption = () => {
        toasterror("You have been interrupted!");
        interruptionaudio.play();
    };

    const interrupt = () => {
        playinterruption();
        nextquestion();
        setinterruptionInQueue(false);
    };

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
                    interrupt();
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

    const recorder = new MicRecorder({bitRate: 1028});

    const [audioStopped,
        setaudioStopped] = useState(false);
    let buffercollected = false;
    const stopMicRecording = () => {
        // if(audioStopped){     return; };
        recorder
            .stop()
            .getMp3()
            .then(([buffer, blob] : any) => {
                // do what ever you want with buffer and blob Example: Create a mp3 file and
                // play
                if (buffercollected) {
                    return;
                };
                buffercollected = true;
                let currentaudiorecordings = audioRecordings;

                const file = new File(buffer, `${Date.now()}.mp3`, {
                    type: blob.type,
                    lastModified: Date.now()
                });
                let recordingobject = {
                    question: question,
                    file: file
                }

                if (audioRecordings.some((e : any) => e.question === question)) {
                    console.log("recording already exists");
                } else if (currentaudiorecordings.length > 0) {
                    let newrecordings = [
                        ...audioRecordings,
                        recordingobject
                    ];
                    setaudioRecordings(newrecordings)
                } else {
                    setaudioRecordings([recordingobject]);
                };
                // console.log(URL.createObjectURL(file));
                setaudioStopped(false);

                // const player = new Audio(URL.createObjectURL(file)); player.play();

            })
            .catch((e : any) => {
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
        if (!audioStopped) {
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
        let synth:any;
        if (window && typeof window !== 'undefined') {
        synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance();
        utterance.voice = randomVoice;
        utterance.text = question;
        synth.speak(utterance);
        };
        if (!audioStopped) {
            setaudioStopped(true);
            recorder
                .start()
                .then(() => {
                    // console.log("recording started");
                })
                .catch((e : any) => {
                    console.error(e);
                });
        };

        return () => {
            document.removeEventListener("keydown", (e : KeyboardEvent) => console.log(e));
            // setaudioStopped(false);
            synth?.cancel();
        };

    }, [question]);

    return (

        <div className="questionContainer">

            {isplaying && <div
                className="questiontextwrapper d-flex justify-centent-center align-items-center">

<div
                    className=' d-flex justify-right align-items-center text-center m-auto mb-4 text-sm flex-col'>
                        <div className="text">

                   Press any key for the next question
                        </div>

                <div className="https://www.youtube.com/watch?v=V-_O7nl0Ii0">
                <button onClick={nextquestion} className="text-xs font-thin subpixel-antialiased italic btn btn-md btn-active btn-square btn-secondary gap-2">
                    Or Press here
                    </button>

                </div>
                </div>
                <div
                    className="mb-3 underline decoration-solid decoration-pink-500 hover:decoration-wavy questioncontain text-3xl  font-bold capitalize antialiased text-rose-600 hover:text-emerald-600 text-center">
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