function numberWithSpaces(x) {
    x = Number(x).toFixed(2)
    const [_, num, suffix] = x.toString().match(/^(.*?)((?:[,.]\d+)?|)$/);
    return `${num.replace(/\B(?=(?:\d{3})*$)/g, ' ')}${suffix}`;
}


const getWinText = lineData => {
    let textWinLine = lineData.lineType === 'SCATTER_LINE' 
        ? 'Scatters'
        : lineData.lineNumber
    return [numberWithSpaces(lineData.win), textWinLine]
}


export {
    getWinText,
    numberWithSpaces,
} 