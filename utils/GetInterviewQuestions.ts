let requiredQuestionsArray = ['Why this university?', 'Why this major?', 'Sponsor?'];
let semirequiredQuestionsArraywith90pcprobability = ['Why the US?', 'Plans after graduation?'];
let optionalQuestionsArray = ['Specialization?', 'What is the name of the university where you are going to study?', 'How did you hear about this university and arrange your admission?', 'What are your hobbies?', 'Will you apply for more scholarships?'];

function shuffle(array:Array<string>) {
    if (array.length < 1) {
        return [];
    }
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    };
    return array;
};

function randomIntFromInterval(min:number, max:number) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
};

export default async function getInterviewQuestions() {
    let requiredQarr = shuffle(requiredQuestionsArray);
    let semirequiredArr = [];
    let optionalWithLowProb = [];
    for (let x in semirequiredQuestionsArraywith90pcprobability) {
        let probforsemiRequiredArray = randomIntFromInterval(1, 100)
        if (probforsemiRequiredArray <= 65) {
            semirequiredArr.push(semirequiredQuestionsArraywith90pcprobability[x])
        };
    };

    for (let k in optionalQuestionsArray) {
        let probforsemiRequiredArray = randomIntFromInterval(1, 100)
        if (probforsemiRequiredArray <= 5) {
            optionalWithLowProb.push(optionalQuestionsArray[k])
        };
    };
    let semiandoptionalShuffle = shuffle([
        ...semirequiredArr,
        ...optionalWithLowProb
    ]);
    let newArray = [
        ...requiredQarr,
        ...semiandoptionalShuffle
    ];
    if (!(newArray.indexOf('Plans after graduation?') === -1)) {
        console.log("here")
        newArray = newArray.filter(function (value) {
            return value !== 'Plans after graduation?'
        });
        newArray.push('Plans after graduation?');
        if (!(newArray.indexOf('Sponsor?') === -1)) {
            newArray = newArray.filter(function (value) {
                return value !== 'Sponsor?'
            });
            newArray.push('Sponsor?');
        };
    };

    if (!(newArray.indexOf('What is the name of the university where you are going to study?') === -1)) {
        console.log("here")
        newArray = newArray.filter(function (value) {
            return value !=='What is the name of the university where you are going to study?'
        });
        newArray.unshift('What is the name of the university where you are going to study?');
    };
    return newArray;
};