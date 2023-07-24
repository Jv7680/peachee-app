import { Button } from "@mui/material";
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { makeStyles } from "@mui/styles";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useState } from "react";
import CustomizedInput from "../customizedInput/CustomizedInput";
import { formatNumberToVND } from "../../utils/functions/functionUtils";
import dayjs, { Dayjs } from 'dayjs';
import APIService from "../../services/ApiService";
import { ResponseData } from "../../services/ApiService";
import Badge from '@mui/material/Badge';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import LoadingButton from '@mui/lab/LoadingButton';
import { isObjectEqual } from "../../utils/functions/functionUtils";
import { TimeField } from '@mui/x-date-pickers/TimeField';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import RadioButtonUncheckedSharpIcon from '@mui/icons-material/RadioButtonUncheckedSharp';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

export interface ClassNoteArrValueItem {
    stt: number;
    className: string;
    attendance: "check" | "noCheck" | "nothing";
    timeRangeEachClass: {
        from: string | null;
        to: string | null;
    };
    moneyEachClass: number;
};

function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected = !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

    return (
        <Badge
            key={props.day.toString()}
            overlap="circular"
            badgeContent={isSelected ? '✓' : undefined}
            color="success"
        >
            <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
    );
}

let inserted: boolean = false;
let classNoteArrValueBackup: ClassNoteArrValueItem[] = [];
let noteValueBackup: string = "";
export default function Calender() {
    const [moneySumNumber, setMoneySumNumber] = useState<number>(0);
    const [noteValue, setNoteValue] = useState<string>("");
    const [calendarValue, setCalendarValue] = useState<dayjs.Dayjs>(dayjs());
    const [classNoteArrValue, setClassNoteArrValue] = useState<ClassNoteArrValueItem[]>([]);
    const [isCalendarLoading, setIsCalendarLoading] = useState<boolean>(false);
    const [isBtnSaveLoading, setIsBtnSaveCalendarLoading] = useState<boolean>(false);
    const [isNewNote, setIsNewNote] = useState<boolean>(false);
    const [highlightedDays, setHighlightedDays] = useState<number[]>([]);

    const [fromTimeValue, setFromTimeValue] = useState<Dayjs | null>(null);
    const [toTimeValue, settoTimeValue] = useState<Dayjs | null>(null);

    useEffect(() => {
        const noteAreaClassNote = document.getElementsByClassName("noteArea__class-note")[0];
        noteAreaClassNote?.scrollTo(0, noteAreaClassNote.scrollHeight);

        updateMoneySum();
        console.log(classNoteArrValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classNoteArrValue]);

    useEffect(() => {
        fecthDataCalendar();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calendarValue]);

    useEffect(() => {
        console.log("isNewNote", isNewNote);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNewNote]);

    useEffect(() => {
        console.log(JSON.stringify(classNoteArrValue));
        console.log(JSON.stringify(classNoteArrValueBackup));
        console.log(classNoteArrValue[0] === classNoteArrValueBackup[0]);
        console.log(JSON.stringify(classNoteArrValue) === JSON.stringify(classNoteArrValueBackup));
        if (!isObjectEqual(classNoteArrValue, classNoteArrValueBackup) || noteValue !== noteValueBackup) {
            setIsNewNote(true);
        }
        else {
            setIsNewNote(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classNoteArrValue, noteValue]);

    const fecthDataCalendar = async () => {
        setIsCalendarLoading(true);
        const result: ResponseData<string | null> = await APIService.get(`api/v1/data/get-by-day-month-year?day=${calendarValue.date()}&month=${calendarValue.month() + 1}&year=${calendarValue.year()}`);
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

            setNoteValue("");
            noteValueBackup = "";
        }

        await fecthHighlightedDays(calendarValue);

        setIsCalendarLoading(false);
        setIsNewNote(false);
    };

    const fecthHighlightedDays = async (value: Dayjs) => {
        const result: ResponseData<number[] | null> = await APIService.get(`api/v1/data/get-day-by-month-year?month=${value.month() + 1}&year=${value.year()}`);
        if (result.data) {
            setHighlightedDays(result.data);
        }
        else {
            setHighlightedDays([]);
        }
    };

    const handleCloseNoteArea = (event: any) => {
        const paperNote = document.getElementsByClassName("paper-note")[0] as HTMLDivElement;
        // noteArea && noteArea.style.width = "0px";
        if (paperNote) {
            // paperNote.style.width = "0px";

            paperNote.style.marginRight = "0px";
            paperNote.style.marginLeft = "-40%";
            paperNote.style.transform = "translateX(100%)";
            paperNote.style.opacity = "0";
        }
    };

    const handleOpenNoteArea = (value: Dayjs | null) => {
        console.log(value);

        value && setCalendarValue(value);

        const paperNote = document.getElementsByClassName("paper-note")[0] as HTMLDivElement;
        // noteArea && noteArea.style.width = "0px";
        if (paperNote) {
            // paperNote.style.width = "30%";

            paperNote.style.marginRight = "8px";
            paperNote.style.marginLeft = "0px";
            paperNote.style.transform = "translateX(0)";
            paperNote.style.opacity = "1";
        }
    };

    const updateMoneySum = () => {
        let moneySum: number = 0;
        classNoteArrValue.forEach((item) => {
            moneySum += item.moneyEachClass;
        });

        setMoneySumNumber(moneySum);
    };

    const getEmptyRow = (stt: number): ClassNoteArrValueItem => {
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
        const newArr = [...classNoteArrValue];
        newArr.push(getEmptyRow(classNoteArrValue.length + 1));
        setClassNoteArrValue(newArr);
    };

    const handleDeleteRow = (event: any) => {
        const newArr = [...classNoteArrValue];
        newArr.pop();
        setClassNoteArrValue(newArr);
    };

    const handleSave = async (event: any) => {
        setIsBtnSaveCalendarLoading(true);
        const data = JSON.stringify({ classNoteArrValue, noteValue });
        console.log("data create", data);

        const body = {
            data
        }
        if (!inserted) {
            const result: ResponseData<any> = await APIService.post(`api/v1/data/create-by-day-month-year?day=${calendarValue.date()}&month=${calendarValue.month() + 1}&year=${calendarValue.year()}`, body);
            console.log("res", result);
        }
        else {
            const result: ResponseData<any> = await APIService.patch(`api/v1/data/update-by-day-month-year?day=${calendarValue.date()}&month=${calendarValue.month() + 1}&year=${calendarValue.year()}`, body);
            console.log("res", result);
        }

        await fecthDataCalendar();
        setIsBtnSaveCalendarLoading(false);
    };

    const handleMonthChange = async (value: Dayjs) => {
        setIsCalendarLoading(true);
        await fecthHighlightedDays(value);
        setIsCalendarLoading(false);
    };

    const handleSelectTime = (sttChange: number, value: Dayjs | string | null, timeType: "from" | "to") => {
        setClassNoteArrValue((prev: ClassNoteArrValueItem[]) => {
            const newPrev = [...prev];
            const newValue = JSON.stringify(value).replaceAll('"', "");
            const itemChange = newPrev[sttChange - 1];

            timeType === "from" ? itemChange.timeRangeEachClass.from = newValue : itemChange.timeRangeEachClass.to = newValue;

            return newPrev;
        });
    };

    const handleChangeClassName = (sttChange: number, event: any) => {
        console.log("event", event);

        setClassNoteArrValue((prev: ClassNoteArrValueItem[]) => {
            const newPrev = [...prev];
            // const newValue = JSON.stringify(value).replaceAll('"', "");
            const itemChange = newPrev[sttChange - 1];

            itemChange.className = event.target.value.trim();

            return newPrev;
        });
    };

    const handleChangeAttendance = (sttChange: number, event: any) => {
        console.log("event", event);

        setClassNoteArrValue((prev: ClassNoteArrValueItem[]) => {
            const newPrev = [...prev];
            // const newValue = JSON.stringify(value).replaceAll('"', "");
            const itemChange = newPrev[sttChange - 1];

            itemChange.attendance = event.target.value;

            return newPrev;
        });
    };

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Paper className="paper-calendar" elevation={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        value={calendarValue}
                        onChange={handleOpenNoteArea}
                        onMonthChange={handleMonthChange}
                        // loading={isCalendarLoading}
                        // renderLoading={() => <DayCalendarSkeleton />}
                        showDaysOutsideCurrentMonth
                        fixedWeekNumber={6}
                        slots={{
                            day: ServerDay,
                        }}
                        slotProps={{
                            day: { highlightedDays } as any,
                        }}
                    />
                </LocalizationProvider>
            </Paper>

            <Paper className="paper-note" elevation={2}>
                <LoadingButton
                    sx={{
                        position: "absolute",
                        right: 80,
                        top: 6,
                        height: 30,
                        padding: 0,
                        boxShadow: 'unset',
                        backgroundColor: "#47c14d",
                        "&:hover": {
                            backgroundColor: "#47c14d",
                        }
                    }}
                    disabled={!isNewNote}
                    variant="contained"
                    onClick={handleSave}
                    loading={isBtnSaveLoading}
                >
                    {
                        isNewNote && !isBtnSaveLoading ?
                            <Badge badgeContent={""} color="error" variant="dot">
                                <i className="fa-regular fa-floppy-disk" style={{ fontSize: 15 }}></i>
                            </Badge>
                            :
                            <i className="fa-regular fa-floppy-disk" style={{ fontSize: 15 }}></i>
                    }
                </LoadingButton>
                <Button
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 6,
                        height: 30,
                        padding: 0,
                        boxShadow: 'unset',
                        backgroundColor: "#f44336",
                        "&:hover": {
                            backgroundColor: "#f44336",
                        }
                    }}
                    variant="contained"
                    onClick={handleCloseNoteArea}
                >
                    <i className="fa-solid fa-xmark" style={{ fontSize: 15 }}></i>
                </Button>
                <div id="note-area" className={classes.noteArea}>
                    <Divider
                        textAlign="left"
                        sx={{
                            margin: "4px 0",
                            "& .MuiDivider-wrapper": {
                                fontSize: "0.75rem"
                            },
                            "&::before,&::after": {
                                borderTop: "thin solid rgb(82 55 71 / 68%)",
                            },
                        }}>
                        Buổi học
                    </Divider>

                    <div className="noteArea__class-note">
                        <table className={classes.tableClassNote}>
                            <tbody>
                                <tr style={{ backgroundColor: "rgb(133 188 255)", height: 30 }}>
                                    <th>STT</th>
                                    <th>Tên lớp</th>
                                    <th>Điểm danh</th>
                                    <th>Thời gian</th>
                                    <th>Thành tiền</th>
                                </tr>
                                {
                                    classNoteArrValue.length > 0 &&
                                    classNoteArrValue.map((item, index) => {
                                        return (
                                            <tr key={index} style={{ boxShadow: index !== 0 ? "0px -1px 0px #b8d8ff" : "unset", height: 50 }}>
                                                <td>{item.stt}</td>
                                                <td>
                                                    <TextField
                                                        value={item.className}
                                                        onChange={(event) => { handleChangeClassName(item.stt, event) }}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </td>
                                                <td>
                                                    {/* <Checkbox
                                                        checked={item.attendance === null ? false : item.attendance}
                                                        onChange={(event) => { handleChangeAttendance(item.stt, event) }}
                                                        size="small"
                                                        color="success"
                                                        icon={<RadioButtonUncheckedSharpIcon />}
                                                        checkedIcon={<CheckCircleSharpIcon />}
                                                    />
                                                    <Checkbox
                                                        checked={item.attendance === null ? false : !item.attendance}
                                                        onChange={(event) => { handleChangeAttendance(item.stt, event) }}
                                                        size="small"
                                                        color="error"
                                                        icon={<RadioButtonUncheckedSharpIcon />}
                                                        checkedIcon={<CancelSharpIcon />}
                                                    /> */}
                                                    <FormGroup style={{ flexDirection: "row", justifyContent: "center" }}>
                                                        <FormControlLabel
                                                            value={"check"}
                                                            control={<Checkbox
                                                                checked={item.attendance === "check"}
                                                                onChange={(event) => { handleChangeAttendance(item.stt, event) }}
                                                                size="small"
                                                                color="success"
                                                                icon={<RadioButtonUncheckedSharpIcon />}
                                                                checkedIcon={<CheckCircleSharpIcon />}
                                                            />}
                                                            label=""
                                                        />
                                                        <FormControlLabel
                                                            value={"noCheck"}
                                                            control={<Checkbox
                                                                checked={item.attendance === "noCheck"}
                                                                onChange={(event) => { handleChangeAttendance(item.stt, event) }}
                                                                size="small"
                                                                color="error"
                                                                icon={<RadioButtonUncheckedSharpIcon />}
                                                                checkedIcon={<CancelSharpIcon />}
                                                            />}
                                                            label=""
                                                        />
                                                    </FormGroup>
                                                </td>
                                                <td>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <TimeField
                                                            ampm={false}
                                                            size="small"
                                                            value={item.timeRangeEachClass.from}
                                                            onChange={(newValue) => { handleSelectTime(item.stt, newValue, "from") }}
                                                        />
                                                        <span style={{ position: "relative", top: 4 }}>&nbsp;&#8211;&nbsp;</span>
                                                        <TimeField
                                                            ampm={false}
                                                            size="small"
                                                            value={item.timeRangeEachClass.to}
                                                            onChange={(newValue) => { handleSelectTime(item.stt, newValue, "to") }}
                                                        />
                                                    </LocalizationProvider>
                                                </td>
                                                <td>
                                                    <CustomizedInput
                                                        name="moneyEachClass"
                                                        value={item.moneyEachClass}
                                                        width={100}
                                                        height={30}
                                                        onChange={setClassNoteArrValue}
                                                        stt={item.stt}
                                                        step={100000}
                                                        VND
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr style={{ height: 20 }}>
                                    <td colSpan={5}>
                                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: '4px 0', position: "relative" }}>
                                            {
                                                classNoteArrValue.length > 0 &&
                                                <div className={classes.moneySum}>
                                                    <span>Tổng tiền:</span> {formatNumberToVND(moneySumNumber)}
                                                </div>
                                            }
                                            <div className={classes.deleteRowBtn} onClick={handleDeleteRow}>
                                                <i className="fa-solid fa-xmark"></i>
                                                &nbsp;
                                                <span style={{ fontWeight: "bold" }}>Xóa</span>
                                            </div>
                                            <div className={classes.addRowBtn} onClick={handleAddMoreRow}>
                                                <i className="fa-solid fa-plus"></i>
                                                &nbsp;
                                                <span style={{ fontWeight: "bold" }}>Thêm</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <Divider
                        textAlign="left"
                        sx={{
                            margin: "4px 0",
                            "& .MuiDivider-wrapper": {
                                fontSize: "0.75rem"
                            },
                            "&::before,&::after": {
                                borderTop: "thin solid rgb(82 55 71 / 68%)",
                            },
                        }}>
                        Ghi chú thêm
                    </Divider>
                    <div className="noteArea__more-note">
                        <textarea
                            value={noteValue}
                            placeholder={"Ghi chú..."}
                            onChange={(event) => { setNoteValue(event.target.value) }}
                        />
                    </div>
                </div>
            </Paper>

        </div>
    )
};

const useStyles = makeStyles({
    root: {
        display: "flex",
        height: "100%",

        "& .paper-calendar": {
            flex: 1,
            marginRight: 8,
            marginLeft: 8,
        },
        "& .paper-note": {
            width: "40%",
            marginRight: 8,
            overflowX: "hidden",
            position: "relative",
            transition: "all 0.3s ease-in-out",
        },

        "& .MuiFormControl-root.MuiTextField-root": {
            width: 90,
            "& input": {
                textAlign: "center",
            },
            "& .MuiInputBase-root.MuiOutlinedInput-root": {
                fontSize: '0.75rem',
                height: '30px',
            }
        },

        "& .MuiFormControlLabel-root.MuiFormControlLabel-labelPlacementEnd": {
            margin: 0,
        },

        "& .MuiButtonBase-root.MuiCheckbox-root": {
            padding: 4,
        },
        "& .MuiCheckbox-colorError svg": {
            color: "red",
        },
        "& .MuiCheckbox-colorSuccess svg": {
            color: "green",
        },

        "& .MuiDateCalendar-root, & .MuiYearCalendar-root": {
            width: "auto",
        },

        "& .class-number, & .time-number, & .money-number": {
            margin: "4px 0",
        },

        "& .MuiLoadingButton-loading.Mui-disabled, & .MuiLoadingButton-root.Mui-disabled": {
            backgroundColor: 'rgb(117 199 121)',
        },
        "& .MuiLoadingButton-loadingIndicator": {
            color: "#fff",
        },
        "& .MuiPickersSlideTransition-root, & .MuiDayCalendar-monthContainer": {
            overflow: "visible",
        },
        "& .MuiBadge-badge": {
            fontSize: 12,
            userSelect: "none",
        },
        "& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer": {
            justifyContent: "space-around",
        },
    },
    noteArea: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "40px 8px 8px 8px",

        "& .noteArea__class-note": {
            height: 300,
            overflow: "auto",
        },
        "& .noteArea__more-note": {
            marginTop: 8,
            flex: 1,
            "& textarea": {
                resize: "none",
                width: "100%",
                minHeight: 100,
                height: "100%",
                outline: "unset",
                border: "1px solid #d9d9d9",
                borderRadius: 8,
            },
            "& textarea:hover, & textarea:focus": {
                border: "1px solid #4096ff",
            },
        },
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: 0,
        minWidth: 24,
        padding: 0,
    },
    tableClassNote: {
        fontSize: "0.75rem",
        width: "100%",
        textAlign: "center",
    },
    addRowBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#47c14d",
        fontSize: 12,
        width: 60,
        height: 20,
        borderRadius: 4,
        cursor: "pointer",
        userSelect: "none",
        color: "#fff",
        transition: "box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",

        "&:hover": {
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
        },
        "& i": {
            fontSize: 10,
        }
    },
    deleteRowBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#f44336",
        fontSize: 12,
        width: 60,
        height: 20,
        borderRadius: 4,
        cursor: "pointer",
        userSelect: "none",
        marginRight: 8,
        color: "#fff",
        transition: "box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",

        "&:hover": {
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
        },
        "& i": {
            fontSize: 11,
        }
    },
    moneySum: {
        position: "absolute",
        left: 0,

        "& span": {
            fontStyle: "italic",
            fontWeight: "bold",
        },
    },
});