import {useState, useEffect} from 'react';
import QuestionTimer from './QuestionTimer';
import timerSound from "@/utils/TimerSound";
import useSound from 'use-sound';

const Question = ({questionsEnded, start, stopquestiontimeSound, question, questionFinished} : any) => {
    const [isplaying,
        setisplaying] = useState(true);

    let pressed = false;
    const nextquestion = (e : any) => {
        setisplaying(false);
        document.removeEventListener("keydown", (e : KeyboardEvent) => console.log(e));
        if (!pressed) {
            start();
        };
        pressed = true;
    };

    const timerhasstopped = () => {
        console.log("here finished")
        questionFinished(question);
        setisplaying(true);
        stopquestiontimeSound();
        if (!questionsEnded) {
            document.addEventListener('keydown', (e : KeyboardEvent) => nextquestion(e));
        } else if (questionsEnded) {
            document.removeEventListener("keydown", (e : KeyboardEvent) => console.log(e));
        }
    };

    useEffect(() => {

        document.addEventListener('keydown', (e : KeyboardEvent) => {
            nextquestion(e);
            // start();
        });


        return () => {
            document.removeEventListener("keydown", (e : KeyboardEvent) => console.log(e));
        };

    }, [question]);

    return (

        <div
            className="questionContainer d-flex flex-col justify-center align-items-center m-3">
            <span className='d-flex justify-center align-item-center m-4'>
                Press any key to stop.

            </span>
            <div
                className="mb-3 underline decoration-solid decoration-pink-500 hover:decoration-wavy questioncontainer text-7xl sm:text-3xl font-bold capitalize antialiased text-rose-600 hover:text-emerald-600">
                {question}
            </div>
            {!isplaying && <QuestionTimer timerhasstopped={timerhasstopped}/>}
        </div>

    )
}

export default Question;