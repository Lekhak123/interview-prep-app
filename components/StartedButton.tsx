import React from 'react'
import useSound from 'use-sound';

function StartedButton({started, setstarted,play} : any) {
    

    return (
        <button
            type="button"
            className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            onClick={(e) => {
            setstarted();
            play();
        }}>Start</button>
    )
}

export default StartedButton