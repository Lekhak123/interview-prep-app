import {useState, useRef, useEffect} from 'react';
import QuestionTimer from './QuestionTimer';
import getRandomInterruptiontime from '@/utils/GetInterruptiontime';
import { useCountUp } from 'use-count-up';




const Question = ({
    interruptionMode,
    questionsEnded,
    startTimerAudio,
    stopquestiontimeSound,
    question,
    questionFinished,
    toasterror
} : any) => {
    const [isplaying,
        setisplaying] = useState(true);



    let interruptionaudio = new Audio("/sounds/beep.mp3");

    const playinterruption = ()=>{
        toasterror("You have been interrupted!");
        interruptionaudio.play();
    };


    const interrupt = ()=>{
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
                console.log(interruptiontime)
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
        setisplaying(true);
        document.addEventListener('keydown', (e : KeyboardEvent) => {
            nextquestion();
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
                    className="mb-3 underline decoration-solid decoration-pink-500 hover:decoration-wavy questioncontain text-3xl  font-bold capitalize antialiased text-rose-600 hover:text-emerald-600 text-center">
                    {question}
                </div>
            </div>
}
            <div className="questiontimer d-flex justify-center m-3">

                {!isplaying && <QuestionTimer timerhasstopped={timerhasstopped}/>}
            </div>
        </div>

    )
}

export default Question;