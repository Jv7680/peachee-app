import Badge from '@mui/material/Badge';
import Paper from '@mui/material/Paper';
import { makeStyles } from "@mui/styles";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from "react";
import { ClockLoader } from 'react-spinners';
import APIService, { ResponseData } from "../../services/ApiService";
import NoteModal from "../modals/note-modal/NoteModal";
import "dayjs/locale/vi";

import "./responsive.scss";

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

export default function Calender() {
    const [calendarValue, setCalendarValue] = useState<dayjs.Dayjs>(dayjs());
    const [isCalendarLoading, setIsCalendarLoading] = useState<boolean>(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState<boolean>(false);
    const [highlightedDays, setHighlightedDays] = useState<number[]>([]);

    useEffect(() => {
        // format month label
        let labelMonthHeader = document.querySelector(".MuiPickersCalendarHeader-label") as HTMLDivElement;
        labelMonthHeader.innerText = `Tháng ${calendarValue.month() + 1} ${calendarValue.year()}`;
    }, [calendarValue]);

    useEffect(() => {
        fecthHighlightedDays(calendarValue);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fecthHighlightedDays = async (value: Dayjs, allowLoading: boolean = true) => {
        allowLoading && setIsCalendarLoading(true);

        setCalendarValue(value);
        const result: ResponseData<number[] | null> = await APIService.get(`api/v1/data/get-day-by-month-year?month=${value.month() + 1}&year=${value.year()}`);
        if (result.data) {
            setHighlightedDays(result.data);
        }
        else {
            setHighlightedDays([]);
        }

        allowLoading && setIsCalendarLoading(false);
    };

    const handleCloseNoteModal = (event: any) => {
        setIsNoteModalOpen(false);
    };

    const handleOpenNoteModal = (value: Dayjs | null) => {
        value && setCalendarValue(value);
        setIsNoteModalOpen(true);
    };

    const handleMonthChange = async (value: Dayjs) => {
        setIsNoteModalOpen(false);
        await fecthHighlightedDays(value);
    };

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Paper className="paper-calendar" elevation={3}>
                {
                    isNoteModalOpen &&
                    <NoteModal
                        isOpen={isNoteModalOpen}
                        calendarValue={calendarValue}
                        name={`Ghi Chú ${calendarValue.date()}/${calendarValue.month() + 1}/${calendarValue.year()}`}
                        handleClose={handleCloseNoteModal}
                        fecthHighlightedDays={fecthHighlightedDays}
                    />
                }
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="vi"
                >
                    <DateCalendar
                        value={calendarValue}
                        onChange={handleOpenNoteModal}
                        onMonthChange={handleMonthChange}
                        onYearChange={handleMonthChange}
                        loading={isCalendarLoading}
                        renderLoading={() => <ClockLoader
                            loading={true}
                            speedMultiplier={0.8}
                            color="#1976D2"
                            size={100}
                        />
                        }
                        showDaysOutsideCurrentMonth
                        fixedWeekNumber={6}
                        slots={{
                            day: ServerDay,
                        }}
                        slotProps={{
                            day: { highlightedDays } as any,
                        }}
                        dayOfWeekFormatter={(day) => day.toUpperCase()}
                    />
                </LocalizationProvider>
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
            width: "50%",
            marginRight: 8,
            overflowX: "hidden",
            position: "relative",
            transition: "all 0.3s ease-in-out",
        },

        "& .MuiFormControl-root.MuiTextField-root": {
            width: 80,
            "& input": {
                textAlign: "center",
            },
            "& .MuiInputBase-root.MuiOutlinedInput-root": {
                fontSize: '0.75rem',
                height: '30px',
            },
            "&.input-class-number": {
                width: 130,
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

        "& .table-action": {
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: '0px 4px',
            margin: '12px 0 8px 0',
            position: "relative",
            fontSize: "0.75rem",
        },
        "& .note-area-loading": {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: "#ffffff",
            position: "absolute",
            top: 0,
            right: 0,
            width: "100%",
            height: "100%",
            zIndex: 10,
        },
        "& .noteArea__class-note": {
            height: 300,
            overflow: "auto",
            position: "relative",
            padding: "0 4px",
        },
        "& .noteArea__more-note": {
            marginTop: 8,
            flex: 1,
            position: "relative",
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