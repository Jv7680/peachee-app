import { Order } from "../../components/table/enhanced-table-head/EnhancedTableHead";

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

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator<Key extends keyof any>(order: Order, orderBy: Key,): (
    a: { [key in Key]: any },
    b: { [key in Key]: any },
) => number {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
