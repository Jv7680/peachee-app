
import { TextField } from "@mui/material";
import { formatNumberToVND } from "../../utils/functions/functionUtils";
import { TableRowData } from "../modals/note-modal/NoteModal";

import "./number-input.scss";

interface NumberInputProps {
    value: number;
    onChange: Function;
    className?: string;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    readOnly?: boolean;
    width?: number | string;
    height?: number;
    name?: string;
    stt?: number;
    VND?: boolean;
};

interface ClassNoteArrValueItem extends TableRowData { };

export default function NumberInput(props: NumberInputProps) {

    const handleChange = (event: any) => {
        const name: string = event.target.name || "moneyEachClass";
        const valueInput: string = event.target.value.replaceAll(/[^0-9]/img, "") || "0";

        let newValue: number = 0;
        if (valueInput.charAt(0) !== "0") {
            newValue = +valueInput;
        }
        const sttChange = props.stt || 1;

        props.onChange((prev: ClassNoteArrValueItem[]) => {
            const newPrev = [...prev];
            const itemChange = newPrev[prev.findIndex(item => item.stt === sttChange)];

            if (name === "moneyEachClass") {
                itemChange[name] = newValue;
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
            const itemChange = newPrev[prev.findIndex(item => item.stt === sttChange)];

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
            const itemChange = newPrev[prev.findIndex(item => item.stt === sttChange)];

            if (name === "moneyEachClass") {
                itemChange[name] -= step;
                if (itemChange[name] < 0) {
                    itemChange[name] = 0
                }
                return newPrev;
            }
        });
    }

    return (
        <div className={"number-input-container"} style={{ width: props.width || 62 }}>
            <TextField
                value={props.VND ? formatNumberToVND(props.value) : props.value}
                onChange={handleChange}
                variant="outlined"
                size="small"
                className={props.className}
                disabled={props.disabled}
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