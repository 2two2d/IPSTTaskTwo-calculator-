import {print} from './utils/print.js'

const DIVISION_BY_ZERO_ERROR = 'Невозможно поделить на 0!'
// Функция clearLastAction очищает последний символ строки
const clearLastAction = (theLine) => {

    theLine.slice(-1) === ' ' ?
        theLine = theLine.slice(0, -3) :
        theLine = theLine.slice(0, -1)

    return theLine
}
// В функции constructTheLine формируется сам пример, при добавление знака операции, он обособляется пробелами,
// при попытки ввести подряд несколько знаков операции, они будут менятся а не идти друг за другом,
// аналогично происходит с символом точки
const constructTheLine = (theLine, state) => {

    if (/[0-9]/.test(state)) {

        theLine.charAt(0) === ' ' ?
            theLine = state :
            theLine += state

    } else if (state === '.') {

        if (/[0-9]/.test(theLine.slice(-1)) &&
            theLine.split(' ').at(-1).indexOf('.') === -1) {
            theLine += state
        }

    } else {

        state = ' ' + state + ' '

        theLine.slice(-1) === ' ' ?
            theLine = theLine.slice(0, -3) + state :
            theLine += state
    }

    return theLine
}
// В функции doMath происходят математические расчёты, на входит приходит строка из
// чисел и операций, обособленных пробелами, на выходе - результат
const doMath = (theLine) => {

    let isDivisionByZero = false

    if (theLine.slice(-1) === ' ') theLine = clearLastAction(theLine)

    let result = 0

    let plusesAndMinuses = theLine.split('').filter((item) => {
        return item === '+' || item === '-'
    })

    theLine = theLine.split(/\+|\-/).map((item) => {

        let subResult = 0

        let subLine = item.trim().split(' ')

        for (let i = 0; i < subLine.length; i++) {
            if (subResult === 0 && /\/|x/.test(subLine[i])) {
                subLine[i] === '/' ?
                    subLine[i + 1] === '0' ?
                        isDivisionByZero = true :
                        subResult = Number(subLine[i - 1]) / Number(subLine[i + 1]) :
                    subResult = Number(subLine[i - 1]) * Number(subLine[i + 1])

            } else if (subResult !== 0 && /\/|x/.test(subLine[i])) {
                subLine[i] === '/' ?
                    subResult = subResult / Number(subLine[i + 1]) :
                    subResult = subResult * Number(subLine[i + 1])
            }
            if (/^[0-9\.]+$/.test(subLine)) subResult = Number(subLine)
        }

        return subResult
    })

    result = Number(theLine[0])

    for (let i = 0; i < plusesAndMinuses.length; i++) {
        result = plusesAndMinuses[i] === '+' ?
            result + Number(theLine[i + 1]) :
            result - Number(theLine[i + 1])
    }

    if (isDivisionByZero) return DIVISION_BY_ZERO_ERROR

    return result.toString()
}

// В мейне идёт проверка на действие пользователя, при нажатии на C очищается вся строка,
// при нажатии на AC удаляется последнее действие, при нажатии на равно происходят мат. расчёты
const main = () => {

    let theLine = ''

    return (state) => {

        if (theLine === DIVISION_BY_ZERO_ERROR) theLine = ''

        if (state === 'С') {
            theLine = clearLastAction(theLine)
        } else if (state === 'АС') {
            theLine = '0'
        } else if (state === '=') {
            theLine = doMath(theLine)
        } else {
            theLine = constructTheLine(theLine, state)
        }

        print(theLine)
    }
}

export default main