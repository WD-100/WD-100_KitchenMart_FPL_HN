function ConvertCurrency(num) {
    let formattedNumber = convertNumberToString(num);
    formattedNumber = formattedNumber + 'đ';
    return formattedNumber
}

export function convertNumberToString(num) {
    if (isNaN(num)) {
        return "0";
    }

    num = parseFloat(num);

    if (num % 1 === 0) {
        return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    const parts = num.toString().split('.');
    let decimalPart = parts[1] || '';

    decimalPart = decimalPart.replace(/0+$/, '');

    const decimalLength = Math.min(decimalPart.length, 3);

    return num.toLocaleString(undefined, {
        minimumFractionDigits: decimalLength,
        maximumFractionDigits: decimalLength
    });
}

export default ConvertCurrency
