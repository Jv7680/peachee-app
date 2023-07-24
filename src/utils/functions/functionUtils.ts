export function formatNumberToVND(number: number) {
    if (number || number === 0) {
        return (number.toLocaleString('vi-VN') + " đ");
    }
    return "Lỗi Format!";
}

export function isObjectEqual(objectA: any, objectB: any) {
    if (!(objectA instanceof Object) || !(objectB instanceof Object)) {
        return false;
    }

    return JSON.stringify(objectA) === JSON.stringify(objectB);
}