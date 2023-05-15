import {useState, useEffect} from 'react';
import {CountdownCircleTimer} from 'react-countdown-circle-timer';

function randomIntFromInterval(min : number, max : number) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
};

const QuestionTimer = ({timerhasstopped} : any) => {

    const [show,
        setshow] = useState(true);
    const [isplaying,
        setisplaying] = useState(true);

    let duration : number = randomIntFromInterval(4, 10);

    return (

        <div className="timer">
            {show && <CountdownCircleTimer
                isPlaying={isplaying}
                duration={duration}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[7, 5, 2, 0]}
                onComplete={() => {
                setshow(false);
                setisplaying(false);
                timerhasstopped();
            }}>
                {({remainingTime}) => remainingTime}
            </CountdownCircleTimer>
}

        </div>

    )
}

export default QuestionTimer;