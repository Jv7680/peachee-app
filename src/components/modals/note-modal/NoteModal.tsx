import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import RadioButtonUncheckedSharpIcon from '@mui/icons-material/RadioButtonUncheckedSharp';
import { Checkbox, FormControlLabel, FormGroup, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { TimeField } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from "react";
import APIService, { ResponseData } from '../../../services/ApiService';
import RichTextInputComponent from '../../../utils/components/RichTextInputComponent';
import { formatNumberToVND, getComparator, isObjectEqual, stableSort } from '../../../utils/functions/functionUtils';
import { HeadCell } from "../../../utils/interfaces/tableInterfaces";
import CustomizedModal, { CustomizedModalProps } from "../../customized-modal/CustomizedModal";
import CustomizedInput from '../../customizedInput/CustomizedInput';
import EnhancedTableHead, { Order } from '../../table/enhanced-table-head/EnhancedTableHead';
import EnhancedTableToolbar from '../../table/enhanced-table-toolbar/EnhancedTableToolbar';
import Swal from 'sweetalert2';

import "./note-modal.scss";
import "./table-responsive.scss";

interface NoteModalProps extends CustomizedModalProps {
    calendarValue: dayjs.Dayjs;
    setCalendarValue?: Function;
    fecthHighlightedDays: Function;
}

export interface TableRowData {
    stt: number;
    className: string;
    attendance: "check" | "noCheck" | "nothing";
    timeRangeEachClass: {
        from: string | null;
        to: string | null;
    };
    moneyEachClass: number;
};

const tabValues = {
    classNote: 0,
    moreNote: 1,
};

const headCells: HeadCell<TableRowData>[] = [
    {
        id: "className",
        numeric: false,
        disablePadding: true,
        label: "Tên lớp",
    },
    {
        id: "attendance",
        numeric: false,
        disablePadding: true,
        label: "Điểm danh",
    },
    {
        id: "timeRangeEachClass",
        numeric: false,
        disablePadding: true,
        label: "Thời gian",
    },
    {
        id: "moneyEachClass",
        numeric: true,
        disablePadding: true,
        label: "Thu nhập",
    },
];

let inserted: boolean = false;
let classNoteArrValueBackup: TableRowData[] = [];

let initNoteValue: string = "<p><br></p>";
let noteValueBackup: string = initNoteValue;
export default function NoteModal(props: NoteModalProps) {
    const [tabValue, setTabValue] = useState<number>(tabValues.classNote);
    const [classNoteArrValue, setClassNoteArrValue] = useState<TableRowData[]>([]);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof TableRowData>("stt");
    const [selected, setSelected] = useState<number[]>([]);

    const [moneySumNumber, setMoneySumNumber] = useState<number>(0);
    const [noteValue, setNoteValue] = useState<string>(initNoteValue);
    const [isNoteAreaLoading, setIsNoteAreaLoading] = useState<boolean>(false);
    const [isBtnSaveLoading, setIsBtnSaveLoading] = useState<boolean>(false);
    const [isNewNote, setIsNewNote] = useState<boolean>(false);

    useEffect(() => {
        return () => {
            classNoteArrValueBackup = [];
            noteValueBackup = initNoteValue;
        };
    }, []);

    useEffect(() => {
        fecthDataTableNote();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.calendarValue]);

    useEffect(() => {
        updateMoneySum();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classNoteArrValue]);

    useEffect(() => {
        if (!isObjectEqual(classNoteArrValue, classNoteArrValueBackup) || noteValue !== noteValueBackup) {
            setIsNewNote(true);
        }
        else {
            setIsNewNote(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classNoteArrValue, noteValue]);

    const fecthDataTableNote = async (allowLoading: boolean = true) => {
        allowLoading && setIsNoteAreaLoading(true);

        const result: ResponseData<string | null> = await APIService.get(`api/v1/data/get-by-day-month-year?day=${props.calendarValue.date()}&month=${props.calendarValue.month() + 1}&year=${props.calendarValue.year()}`);
        if (result.data) {
            inserted = true;
            const newData = JSON.parse(result.data);

            setClassNoteArrValue(newData.classNoteArrValue);
            classNoteArrValueBackup = JSON.parse(JSON.stringify(newData.classNoteArrValue));

            setNoteValue(newData.noteValue);
            noteValueBackup = newData.noteValue;
        }
        else {
            inserted = false;
            setClassNoteArrValue([]);
            classNoteArrValueBackup = [];

            setNoteValue(initNoteValue);
            noteValueBackup = initNoteValue;
        }

        setIsNewNote(false);

        allowLoading && setIsNoteAreaLoading(false);
    };

    const handleChangeTabValue = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const getEmptyRow = (stt: number): TableRowData => {
        return {
            stt: stt,
            className: "",
            attendance: "nothing",
            timeRangeEachClass: {
                from: null,
                to: null,
            },
            moneyEachClass: 0,
        }
    };

    const handleAddMoreRow = (event: any) => {
        const currentLenght = classNoteArrValue.length;
        const newRow = currentLenght === 0 ? getEmptyRow(1) : getEmptyRow(classNoteArrValue[currentLenght - 1].stt + 1);
        const newArr = [...classNoteArrValue];
        newArr.push(newRow);
        setClassNoteArrValue(newArr);

        setTimeout(() => {
            const tableClassNote = document.querySelector(".MuiTableContainer-root");
            tableClassNote?.scrollTo(0, tableClassNote.scrollHeight);
        }, 50);
    };

    const handleDeleteRow = (event: any) => {
        const newArr = classNoteArrValue.filter(item => !selected.find(itemSelect => itemSelect === item.stt));
        setClassNoteArrValue(newArr);
        setSelected([]);
    };

    const updateMoneySum = () => {
        let moneySum: number = 0;
        classNoteArrValue.forEach((item) => {
            moneySum += item.moneyEachClass;
        });

        setMoneySumNumber(moneySum);
    };

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof TableRowData,) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = classNoteArrValue.map((item) => item.stt);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, stt: number) => {
        const selectedIndex = selected.indexOf(stt);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, stt);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const isSelected = (stt: number) => selected.indexOf(stt) !== -1;

    const handleSave = async (event?: any) => {
        setIsBtnSaveLoading(true);
        const data = JSON.stringify({ classNoteArrValue, noteValue });

        const body = {
            data
        };
        if (!inserted) {
            await APIService.post(`api/v1/data/create-by-day-month-year?day=${props.calendarValue.date()}&month=${props.calendarValue.month() + 1}&year=${props.calendarValue.year()}`, body);
        }
        else {
            await APIService.patch(`api/v1/data/update-by-day-month-year?day=${props.calendarValue.date()}&month=${props.calendarValue.month() + 1}&year=${props.calendarValue.year()}`, body);
        }

        await fecthDataTableNote(false);
        await props.fecthHighlightedDays(props.calendarValue);
        setIsBtnSaveLoading(false);
    };

    const handleReset = () => {
        setClassNoteArrValue(JSON.parse(JSON.stringify(classNoteArrValueBackup)));
        setNoteValue(noteValueBackup);
    };

    const handleChangeClassName = (sttChange: number, event: any) => {
        console.log("event", event);

        setClassNoteArrValue((prev: TableRowData[]) => {
            const newPrev = [...prev];
            // const newValue = JSON.stringify(value).replaceAll('"', "");
            const itemChange = newPrev[prev.findIndex(item => item.stt === sttChange)];

            itemChange.className = event.target.value.trim();

            return newPrev;
        });
    };

    const handleChangeAttendance = (sttChange: number, event: any) => {
        setClassNoteArrValue((prev: TableRowData[]) => {
            const newPrev = [...prev];
            // const newValue = JSON.stringify(value).replaceAll('"', "");
            const itemChange = newPrev[prev.findIndex(item => item.stt === sttChange)];

            itemChange.attendance = event.target.value;

            return newPrev;
        });
    };

    const handleSelectTime = (sttChange: number, value: Dayjs | string | null, timeType: "from" | "to") => {
        setClassNoteArrValue((prev: TableRowData[]) => {
            const newPrev = [...prev];
            const newValue = JSON.stringify(value).replaceAll('"', "");
            const itemChange = newPrev[prev.findIndex(item => item.stt === sttChange)];

            timeType === "from" ? itemChange.timeRangeEachClass.from = newValue : itemChange.timeRangeEachClass.to = newValue;

            return newPrev;
        });
    };

    const handleClose = (event: any) => {
        if (isNewNote) {
            Swal.fire({
                title: `<span style="font-size: 1.5rem; cursor: default;">Chưa Lưu Nè <span style="color: #ff5f7b;">❤</span></span>`,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Lưu",
                denyButtonText: "Bỏ qua",
                cancelButtonText: "Trở lại",
                allowOutsideClick: false,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await handleSave();
                    Swal.fire({
                        title: `<span style="font-size: 1.5rem; cursor: default;">Đã Lưu <span style="color: #ff5f7b;">❤</span></span>`,
                        icon: "success",
                        timer: 1000,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                    }).then(() => {
                        props.handleClose();
                    });
                } else if (result.isDenied) {
                    props.handleClose();
                }
            });
        }
        else {
            props.handleClose();
        }
    };

    return (
        <CustomizedModal
            isOpen={props.isOpen}
            handleClose={handleClose}
            name={props.name}
            className="note-modal"
        >
            <Tabs
                value={tabValue}
                onChange={handleChangeTabValue}
                aria-label="note-modal-tab"
            >
                <Tab label="Thông tin lớp" />
                <Tab label="Ghi chú" />
            </Tabs>
            {
                tabValue === tabValues.classNote && !isNoteAreaLoading && (
                    <>
                        {
                            selected.length === 0 && (
                                <div className="money-sum">
                                    <span>Tổng tiền:&nbsp;<span>{formatNumberToVND(moneySumNumber)}</span></span>
                                </div>
                            )
                        }
                        <EnhancedTableToolbar
                            numSelected={selected.length}
                            deleteIconTooltipText="Xóa"
                            handleDelete={handleDeleteRow}
                            showAddIcon
                            addIconTooltipText="Thêm"
                            disableAddIcon={isBtnSaveLoading || isNoteAreaLoading}
                            handleAdd={handleAddMoreRow}
                            showResetIcon
                            resetIconTooltipText="Đặt lại"
                            handleReset={handleReset}
                            disableResetIcon={!isNewNote || isBtnSaveLoading}
                            showSaveIcon
                            saveIconTooltipText="Lưu"
                            disableSaveIcon={!isNewNote}
                            isSaveIconLoading={isBtnSaveLoading}
                            handleSave={handleSave}
                        />
                        <TableContainer>
                            <Table
                                sx={{ minWidth: 750 }}
                                aria-labelledby="tableTitle"
                                size={"medium"}
                            >
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={classNoteArrValue.length}
                                    headCells={headCells}
                                />
                                <TableBody>
                                    {
                                        stableSort(classNoteArrValue, getComparator(order, orderBy)).map((row, index) => {
                                            const isItemSelected = isSelected(row.stt);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.stt}
                                                    selected={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            color="primary"
                                                            onClick={(event) => handleClick(event, row.stt)}
                                                            checked={isItemSelected}
                                                            inputProps={{
                                                                'aria-labelledby': labelId,
                                                            }}
                                                            disabled={isBtnSaveLoading}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <TextField
                                                            value={row.className}
                                                            onChange={(event) => { handleChangeClassName(row.stt, event) }}
                                                            variant="outlined"
                                                            size="small"
                                                            className="input-class-number"
                                                            disabled={isBtnSaveLoading}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <FormGroup style={{ flexDirection: "row", justifyContent: "center", flexWrap: "nowrap" }}>
                                                            <FormControlLabel
                                                                value={"check"}
                                                                style={{ margin: 0 }}
                                                                control={<Checkbox
                                                                    checked={row.attendance === "check"}
                                                                    onChange={(event) => { handleChangeAttendance(row.stt, event) }}
                                                                    size="small"
                                                                    color="success"
                                                                    icon={<RadioButtonUncheckedSharpIcon />}
                                                                    checkedIcon={<CheckCircleSharpIcon />}
                                                                    disabled={isBtnSaveLoading}
                                                                />}
                                                                label=""
                                                            />
                                                            <FormControlLabel
                                                                value={"noCheck"}
                                                                style={{ margin: 0 }}
                                                                control={<Checkbox
                                                                    checked={row.attendance === "noCheck"}
                                                                    onChange={(event) => { handleChangeAttendance(row.stt, event) }}
                                                                    size="small"
                                                                    color="error"
                                                                    icon={<RadioButtonUncheckedSharpIcon />}
                                                                    checkedIcon={<CancelSharpIcon />}
                                                                    disabled={isBtnSaveLoading}
                                                                />}
                                                                label=""
                                                            />
                                                        </FormGroup>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <TimeField
                                                                ampm={false}
                                                                size="small"
                                                                value={row.timeRangeEachClass.from}
                                                                onChange={(newValue) => { handleSelectTime(row.stt, newValue, "from") }}
                                                                disabled={isBtnSaveLoading}
                                                            />
                                                            <span style={{ position: "relative", top: 10 }}>&nbsp;&#8211;&nbsp;</span>
                                                            <TimeField
                                                                ampm={false}
                                                                size="small"
                                                                value={row.timeRangeEachClass.to}
                                                                onChange={(newValue) => { handleSelectTime(row.stt, newValue, "to") }}
                                                                disabled={isBtnSaveLoading}
                                                            />
                                                        </LocalizationProvider>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <CustomizedInput
                                                            name="moneyEachClass"
                                                            value={row.moneyEachClass}
                                                            width={"90%"}
                                                            height={40}
                                                            onChange={setClassNoteArrValue}
                                                            stt={row.stt}
                                                            step={100000}
                                                            VND
                                                            disabled={isBtnSaveLoading}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {/* {
                                        emptyRows > 0 && (
                                            <TableRow
                                                style={{
                                                    height: (dense ? 33 : 53) * emptyRows,
                                                }}
                                            >
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )
                                    } */}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )
            }
            {
                tabValue === tabValues.moreNote && !isNoteAreaLoading && (
                    <>
                        <EnhancedTableToolbar
                            numSelected={0}
                            showResetIcon
                            resetIconTooltipText="Đặt lại"
                            handleReset={handleReset}
                            disableResetIcon={!isNewNote || isBtnSaveLoading}
                            showSaveIcon
                            saveIconTooltipText="Lưu"
                            disableSaveIcon={!isNewNote}
                            isSaveIconLoading={isBtnSaveLoading}
                            handleSave={handleSave}
                        />
                        <RichTextInputComponent
                            value={noteValue}
                            placeholder={"Nội dung*"}
                            onChange={(newNoteValue: string) => { setNoteValue(newNoteValue) }}
                            disabled={isBtnSaveLoading}
                        />
                    </>
                )
            }
            {
                isNoteAreaLoading && (
                    <Stack spacing={1} flex={1}>
                        <Skeleton variant="rounded" width={"100%"} height={70} />
                        <Skeleton style={{ flex: 1 }} variant="rounded" width={"100%"} height={40} />
                        <Skeleton style={{ flex: 1 }} variant="rounded" width={"100%"} height={40} />
                        <Skeleton style={{ flex: 1 }} variant="rounded" width={"100%"} height={40} />
                    </Stack>
                )
            }
        </CustomizedModal>
    );
};