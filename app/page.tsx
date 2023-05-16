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

    const [audioStatus,
        changeAudioStatus] = useState(false);

    const questionTimerAudioRef = useRef < any > ();

    // let questiontimeraudio = new Audio(SoundLocation);

    const playQuestionTimerAudio = () => {
        if (questionsEnded) {
            return;
        }
        questionTimerAudioRef
            ?.current
                ?.play();
        changeAudioStatus(true);
    };

    const stopQuestionTimerAudio = () => {
        questionTimerAudioRef
            ?.current
                ?.pause();
        changeAudioStatus(false);
    };

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
            getQuestions();
        };
    };

    const handleStartButton = () => {
        setstarted(true);
    };

    const [questionArray,
        setquestionArray] = useState < any > ([]);

    const [questionsEnded,
        setquestionsEnded] = useState(false);
    const [questionsNumber,
        setquestionsNumber] = useState(0);
    const [currentQuestion,
        setcurrentQuestion] = useState("");

    const getQuestions = async() => {
        let questions = await getInterviewQuestions();
        setquestionArray(questions);
        setquestionsNumber(questions.length - 1);
        setcurrentQuestion(questions[0]);
    }
    useEffect(() => {
        getQuestions();

    }, []);

    const stoptime = () => {
        stop();
        resetSound();
        setquestionsStart(true);
    };

    const stopQuestionstime = () => {
        stopQuestionTimerAudio();
    };

    const questionsFinished = () => {
        stopQuestionTimerAudio();
        setquestionsStart(false);
        getQuestions();
        setquestionsEnded(true);
    };

    const questionFinished = (finishedquestion : string) => {

        if (questionArray.indexOf(finishedquestion) + 1 - questionsNumber === 1) {
            questionsFinished();
        } else if (questionArray.indexOf(finishedquestion) <= questionsNumber) {
            setcurrentQuestion(questionArray[questionArray.indexOf(finishedquestion) + 1]);
        } else {
            questionsFinished();
        };
    };

    const [interruptionMode,
        setinterruptionMode] = useState(false);
    const handleinterruptionchance = (e : any) => {
        let option = e
            ?.target
                ?.checked || false;
        setinterruptionMode(option);
    };

    return (

        <div
            className="App flex min-h-screen flex-col items-center justify-center gap-0 p-auto w-auto">
            <div className="d-flex m-5 justify-center align-center flex-col gap-5 w-auto">

                <div className="fixed top-0  right-0  mt-4 mr-5">
                    {started &&< ResetButton started = {
                        started
                    }
                    stopaudio = {
                        stop
                    }
                    handleResetButton = {
                        handleResetButton
                    } />}

                    {!started && <div className="d-flex justify-center align-middle flex-row">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="toggle toggle-success"
                                id="interruption"
                                checked={interruptionMode}
                                onChange={(e) => {
                                handleinterruptionchance(e)
                            }}/>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Interruption Mode</span>
                        </label>

                    </div>
}
                </div>

            </div>

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

            <div className="questionandtimerwrapper d-flex justify-center flex-col">

                {questionsStart && <Question
                    questionsEnded={questionsEnded}
                    stopquestiontimeSound={stopQuestionstime}
                    start={playQuestionTimerAudio}
                    questionFinished={questionFinished}
                    question={currentQuestion}
                    interruptionMode={interruptionMode}/>
}
                {questionsStart && <audio ref={questionTimerAudioRef} src={SoundLocation}/>}

            </div>
            <div className='ml-10 d-flex justify-center w-auto align-items-center'>

                {started && <CircleTimer stoptime={stoptime} duration={5}/>}
            </div>
            {questionsEnded && <div>Questions ended</div>}
        </div>
    )
}
