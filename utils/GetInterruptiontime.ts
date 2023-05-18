function randomIntFromInterval(min:number, max:number) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
};

export default async function getRandomInterruptiontime() {
    let probability:number = randomIntFromInterval(1, 100);
    let returntime:number;
    if (probability >= 90) {
        returntime = randomIntFromInterval(10, 20);
    } else if (probability < 90 && probability > 60) {
        returntime = randomIntFromInterval(20, 25);
    } else if (probability <= 60 && probability > 20) {
        returntime = randomIntFromInterval(25, 30);
    } else if (probability <= 20 && probability > 10) {
        returntime = randomIntFromInterval(30, 35);
    } else {
        returntime = randomIntFromInterval(35, 60);
    };

    if (returntime > 40) {
        returntime = randomIntFromInterval(Math.round((Math.abs(returntime) / 2)) || 0, returntime);
    };

    return returntime  * 1000;
};