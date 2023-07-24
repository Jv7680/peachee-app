
import { makeStyles } from "@mui/styles";
import { ClassNoteArrValueItem } from "../calender/Calender";
import { formatNumberToVND } from "../../utils/functions/functionUtils";

interface CustomizedInputProps {
    value: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    onChange: Function;
    step?: number;
    disabled?: boolean;
    readOnly?: boolean;
    width?: number;
    height?: number;
    name?: string;
    stt?: number;
    VND?: boolean;
};

export default function CustomizedInput(props: CustomizedInputProps) {
    const classes = useStyles();

    const handleChange = (event: any) => {
        const name: string = event.target.name || "moneyEachClass";
        console.log(event.target.value);
        const value = +(event.target.value.replaceAll("đ", "").replaceAll(" ", "").replaceAll(".", "").trim() || "0");
        console.log(value);
        const sttChange = props.stt || 1;

        props.onChange((prev: ClassNoteArrValueItem[]) => {
            const newPrev = [...prev];
            const itemChange = newPrev[sttChange - 1];

            if (name === "moneyEachClass") {
                itemChange[name] = value;
                return newPrev;
            }
        });
    }

    const handleClickUp = (event: any) => {
        const step = props.step || 1;
        const name: string = props.name || "classNumber";
        const sttChange = props.stt || 1;

        props.onChange((prev: ClassNoteArrValueItem[]) => {
            const newPrev = [...prev];
            const itemChange = newPrev[sttChange - 1];

            if (name === "moneyEachClass") {
                itemChange[name] += step;
                return newPrev;
            }
        });
    }

    const handleClickDown = (event: any) => {
        const step = props.step || 1;
        const name: string = props.name || "classNumber";
        const sttChange = props.stt || 1;

        props.onChange((prev: ClassNoteArrValueItem[]) => {
            const newPrev = [...prev];
            const itemChange = newPrev[sttChange - 1];

            if (name === "moneyEachClass") {
                itemChange[name] -= step;
                return newPrev;
            }
        });
    }

    return (
        <div className={classes.root + " customized-input-container"} style={{ width: props.width || 62 }}>
            <input
                name={props.name || ""}
                className="customized-input"
                onChange={handleChange}
                value={props.VND ? formatNumberToVND(props.value) : props.value}
                type="text"
                style={{
                    // width: props.width || 40,
                    height: props.height || 40
                }}
            />
            <div className="btn-controll">
                <div
                    className="btn-up"
                    onClick={handleClickUp}
                    style={{ height: props.height ? props.height / 2 : 20 }}
                >
                    <i className="fa fa-angle-up" />
                </div>
                <div
                    className="btn-down"
                    onClick={handleClickDown}
                    style={{ height: props.height ? props.height / 2 : 20 }}
                >
                    <i className="fa fa-angle-down" />
                </div>
            </div>
        </div>
    )
};

const useStyles = makeStyles({
    root: {
        position: 'relative',
        display: "inline-flex",
        borderRadius: 4,

        "&:hover input": {
            border: '1px solid',
        },

        "& input": {
            width: "calc(100% - 22px)",
            outline: "none",
            border: '1px solid #e1e1e1',
            color: '#242424',
            textAlign: 'center',
            background: '#fff',
            padding: 0,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
        },
        "& input:focus": {
            border: "1px solid #4884cd"
        },
        "& .btn-up, & .btn-down": {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #e1e1e1',
            borderRight: '1px solid #e1e1e1',
            borderTop: '1px solid #e1e1e1',
            color: '#333333',
            cursor: 'pointer',
            lineHeight: '20px',
            textAlign: 'center',
            WebkitTransition: 'all 0.3s ease-in-out 0s',
            transition: 'all 0.3s ease-in-out 0s',
            width: '22px',
        },
        "& .btn-up i, & .btn-down i": {
            fontSize: 12,
            height: 9,
        },
        "& .btn-up": {
            borderBottom: 'none',
        },
        "& .btn-down": {

        },
        "& .btn-up:hover, & .btn-down:hover": {
            background: '#ddd',
        },
    },
});