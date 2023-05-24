"use client";
import ResetButton from "@/components/ResetButton";
import StartedButton from "@/components/StartedButton";
import CircleTimer from "@/components/Timer";
import {useState, useEffect, useRef} from "react";
import timerSound from "@/utils/TimerSound";
import useSound from 'use-sound';
import getInterviewQuestions from "@/utils/GetInterviewQuestions";
import Question from "@/components/Question";
import QuestionWithAudio from "@/components/QuestionWithAudio";
import Cookies from 'js-cookie';
import QuestionsFinished from "@/components/QuestionsFinished";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {



    let toasterror = (msg:string)=>{
        toast.error(msg, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            toastId:"interruption"
            });
    };

    const [randomVoice, setrandomVoice] = useState<any>()


 


    const SetCookie = (name : string, value : string | boolean | number) => {
        Cookies
            ?.set(name, `${value}`, {expires: 30});
    };

    const RemoveCookie = (name : string) => {
        Cookies
            ?.remove(name);
    };

    const GetCookie = (name : string) => {
        return Cookies
            ?.get(name) || false;
    };

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
    const [audioRecordings,
        setaudioRecordings] = useState < any > ([]);
    // let questiontimeraudio = new Audio(SoundLocation);

    const playQuestionTimerAudio = () => {
        if (questionsEnded) {
            return;
        };
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
        setquestionsEnded(false);
        setaudioRecordings([]);
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

    const [audioFeedbackMode,
        setaudioFeedbackMode] = useState(true);

    const [SliderValue,
        setSliderValue] = useState(40);
    const changeSlider = (e : any) => {
        let value = e
            ?.target.value;
        setSliderValue(value);
        SetCookie("sliderVolume", value);
    };

    const getQuestions = async() => {
        let questions = await getInterviewQuestions();
        setquestionArray(questions);
        setquestionsNumber(questions?.length - 1);
        setcurrentQuestion(questions[0]);
    };

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

        // if (audioFeedbackMode) {     console.log(audioRecordings);     let file =
        // audioRecordings[0]         ?.file;     console.log(file);     const player =
        // new Audio(URL.createObjectURL(file));     player.playbackRate = SliderValue /
        // 100 || 1.5;     player.play(); };
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
        SetCookie("interruptMode", option);
    };

    const handleaudioFeedbackMode = (e : any) => {
        let option = e
            ?.target
                ?.checked || false;
        setaudioFeedbackMode(option);
        SetCookie("audioFeedbackMode", option);
    };

    const [startedButtonDisabled,
        setstartedButtonDisabled] = useState(true);
    useEffect(() => {
        getQuestions();

        const synth = window.speechSynthesis;
        synth.onvoiceschanged = async function (){
            let voices =await  synth.getVoices();
            let randomvoice = voices[Math.floor(Math.random()*voices.length)];
            setrandomVoice(randomvoice);
        };
    
        let timeout1 = setTimeout(() => {
            setstartedButtonDisabled(false);
        }, 3000);

        try {
            let interruptModeCookieValue = GetCookie("interruptMode");
            if (!interruptModeCookieValue) {
                SetCookie("interruptMode", false);
            } else {
                interruptModeCookieValue = (interruptModeCookieValue === 'true') || false;
                if (interruptionMode !== interruptModeCookieValue) {
                    setinterruptionMode(interruptModeCookieValue);
                };
            }
            let audioFeedbackModeCookieValue = GetCookie("audioFeedbackMode");
            if (!audioFeedbackModeCookieValue) {
                SetCookie("audioFeedbackMode", true);
            } else {
                audioFeedbackModeCookieValue = (audioFeedbackModeCookieValue === 'true') || false;
                if (audioFeedbackMode !== audioFeedbackModeCookieValue) {
                    setaudioFeedbackMode(audioFeedbackModeCookieValue);
                };
            };

            let sliverVloumeCookieValue : any = GetCookie("sliderVolume");
            if (!sliverVloumeCookieValue) {
                SetCookie("sliderVolume", 40);
            } else {
                if (sliverVloumeCookieValue === "0") {
                    sliverVloumeCookieValue = 0;
                } else {
                    sliverVloumeCookieValue = parseInt(sliverVloumeCookieValue) || 40;
                };
                if (SliderValue !== sliverVloumeCookieValue) {

                    let currentvalue = SliderValue;
                    if (currentvalue < sliverVloumeCookieValue) {
                        let interval = setInterval(() => {
                            setSliderValue(currentvalue++);
                            if (currentvalue > sliverVloumeCookieValue) {
                                clearInterval(interval);
                            }
                        }, 10);
                    } else {
                        let interval = setInterval(() => {
                            setSliderValue(currentvalue--);
                            if (currentvalue < sliverVloumeCookieValue) {
                                clearInterval(interval);
                            }
                        }, 10);
                    };
                };
            };

        } catch (error) {};
        return () => {
            clearTimeout(timeout1);
        }
    }, []);






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

                    {!started && <div className="d-flex justify-center align-middle flex-col">
                        <div className="interruption">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="toggle toggle-success"
                                    id="interruption"
                                    checked={interruptionMode}
                                    onChange={(e) => {
                                    handleinterruptionchance(e)
                                }}/>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Interruption</span>
                            </label>

                        </div>
                        <div className="audioFeedbackMode">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="toggle toggle-error"
                                    id="audioFeedbackMode"
                                    checked={audioFeedbackMode}
                                    onChange={(e) => {
                                    handleaudioFeedbackMode(e)
                                }}/>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Voice Feedback</span>
                            </label>
                        </div>

                    </div>
}

                    {(!started || questionsEnded) &&audioFeedbackMode && <div><input
                        type="range"
                        min="0"
                        max="100"
                        onChange={(e) => {
                        changeSlider(e)
                    }}
                        value={SliderValue}
                        className="range range-secondary  range-"/>{SliderValue}</div>}

                </div>

            </div>

            <div className="d-flex justify-content-center align-item-center">
                {!started && !startedButtonDisabled &&< StartedButton started = {
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

                {questionsStart && !audioFeedbackMode && <Question
                    randomVoice={randomVoice}
                    toasterror={toasterror}
                    questionsEnded={questionsEnded}
                    stopquestiontimeSound={stopQuestionstime}
                    startTimerAudio={playQuestionTimerAudio}
                    questionFinished={questionFinished}
                    question={currentQuestion}
                    interruptionMode={interruptionMode}/>
}

                {questionsStart && audioFeedbackMode && <QuestionWithAudio
                    randomVoice={randomVoice}
                    toasterror={toasterror}
                    questionsEnded={questionsEnded}
                    stopquestiontimeSound={stopQuestionstime}
                    startTimerAudio={playQuestionTimerAudio}
                    questionFinished={questionFinished}
                    question={currentQuestion}
                    interruptionMode={interruptionMode}
                    audioFeedbackMode={audioFeedbackMode}
                    setaudioRecordings={setaudioRecordings}
                    audioRecordings={audioRecordings}/>
}
                {questionsEnded && audioFeedbackMode && <QuestionsFinished questionsArray={audioRecordings} volume={SliderValue / 100}/>
}

                {questionsStart && <audio ref={questionTimerAudioRef} src={SoundLocation}/>}

            </div>
            <div className='ml-10 d-flex justify-center w-auto align-items-center'>

                {started && <CircleTimer stoptime={stoptime} duration={5}/>}
            </div>
            {questionsEnded && !audioFeedbackMode && <div>Questions ended</div>}
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="dark"/>
        </div>
    )
}
