
export function formatNumberToVND(number: number) {
    if (number || number === 0) {
        return (number.toLocaleString('vi-VN') + " đ");
    }
    return "Lỗi Format!";
}