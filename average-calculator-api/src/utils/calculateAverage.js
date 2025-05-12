exports.computeAverage = (numbers) => {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
};