"use client";
import ResetButton from "@/components/ResetButton";
import StartedButton from "@/components/StartedButton";
import CircleTimer from "@/components/Timer";
import {useState, useEffect, useRef} from "react";
import timerSound from "@/utils/TimerSound";
import useSound from 'use-sound';
import getInterviewQuestions from "@/utils/GetInterviewQuestions";
import Question from "@/components/Question";
export default function Home() {
    const [started,
        setstarted] = useState(false);
    let soundlocation = timerSound();
    const [SoundLocation,
        setSoundLocation] = useState(soundlocation);
    const [play, {
            pause,
            stop
        }
    ] = useSound(SoundLocation, {
        onplay: () => setIsPlaying(true),
        onend: () => setIsPlaying(false)
    });
    const [isPlaying,
        setIsPlaying] = useState(false);

    const [questionsStart,
        setquestionsStart] = useState(false);
    const resetSound = () => {
        let soundlocation = timerSound();
        setSoundLocation(soundlocation);
    };

    const handleResetButton = () => {
        setstarted(false);
        if (isPlaying) {
            resetSound();
            pause();
            setIsPlaying(!isPlaying);
            setquestionsStart(false);
        };
    };

    const handleStartButton = () => {
        setstarted(true);
    };

    const [questionArray,
        setquestionArray] = useState < any > ([]);


    const [questionsEnded, setquestionsEnded] = useState(false);
    const [questionsNumber,
        setquestionsNumber] = useState(0);
    const [currentQuestion,
        setcurrentQuestion] = useState("");

    const getQuestions = async() => {
        let questions = await getInterviewQuestions();
        setquestionArray(questions);
        console.log(questions)
        setquestionsNumber(questions.length - 1);
        setcurrentQuestion(questions[0]);
    }
    useEffect(() => {
        getQuestions();

    }, [])

    const stoptime = () => {
        stop();
        resetSound();
        setquestionsStart(true);
    };

    const stopQuestionstime = ()=>{
        stop();
        resetSound();
    };

    const questionsFinished = ()=>{
        resetSound();
        setquestionsStart(false);
        getQuestions();
        setquestionsEnded(true);
    };

    const questionFinished = (finishedquestion : string) => {
        
        if(questionArray.indexOf(finishedquestion)+1-questionsNumber===1){
            questionsFinished();
            resetSound();
        }
        else if(questionArray.indexOf(finishedquestion)<=questionsNumber){
            setcurrentQuestion(questionArray[questionArray.indexOf(finishedquestion)+1]);
        } else{
            questionsFinished();
        };
    };

    return (

        <main
            className="App flex min-h-screen flex-col items-center justify-between p-24">
            {started &&< ResetButton started = {
                started
            }
            stopaudio = {
                stop
            }
            handleResetButton = {
                handleResetButton
            } />}
            <div className="d-flex justify-content-center align-item-center">
                {!started &&< StartedButton started = {
                    started
                }
                setstarted = {
                    handleStartButton
                }
                play = {
                    play
                }
                />}
            </div>

                {questionsStart && <Question questionsEnded={questionsEnded} stopquestiontimeSound={stopQuestionstime} start={play} questionFinished={questionFinished} question={currentQuestion}/>}
            {started && <CircleTimer stoptime={stoptime} duration={5}/>}
            {questionsEnded && <div>Questions ended</div>}
        </main>
    )
}
