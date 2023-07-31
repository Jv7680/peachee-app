export interface HeadCell<TableData> {
    disablePadding: boolean;
    id: keyof TableData;
    label: string;
    numeric: boolean;
}
