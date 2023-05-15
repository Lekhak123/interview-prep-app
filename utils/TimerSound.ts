import useSound from "use-sound";
function randomIntFromInterval(min : number, max : number) : number {
    return Math.floor(Math.random() * (max - min + 1) + min)
};

export default function timerSound() {
    let randomTimerNumber : number = randomIntFromInterval(1, 3);
    let soundtouse;
    randomTimerNumber === 1
        ? soundtouse = "/sounds/timers/1.mp3"
        : randomTimerNumber === 2
            ? soundtouse = "/sounds/timers/2.mp3"
            : soundtouse = "/sounds/timers/2.mp3";

    // const [play, {stop}] = useSound(soundtouse, {interrupt: true});
    return soundtouse;

}