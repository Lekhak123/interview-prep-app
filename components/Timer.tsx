import {useState, useEffect} from 'react';
import {CountdownCircleTimer} from 'react-countdown-circle-timer';

const CircleTimer = ({duration,stoptime} : any) => {

    const [show,
        setshow] = useState(true);
    const [isplaying,
        setisplaying] = useState(true);



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
                stoptime();
            }}>
                {({remainingTime}) => remainingTime}
            </CountdownCircleTimer>
}

        </div>

    )
}

export default CircleTimer;