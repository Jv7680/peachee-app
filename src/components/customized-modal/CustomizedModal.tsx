
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Button } from "@mui/material";

import "./customized-modal.scss";

export interface CustomizedModalProps {
    isOpen: boolean;
    handleClose: (event?: {}, reason?: "backdropClick" | "escapeKeyDown") => void;
    name: string;
    className?: string;
    children?: any;
};

export default function CustomizedModal(props: CustomizedModalProps) {


    return (
        <Modal
            open={props.isOpen}
            onClose={props.handleClose}
            disableScrollLock
            disableAutoFocus
            className={"customized-modal-container " + (props.className || "")}
            aria-labelledby="customized-modal"
            aria-describedby="customized-modal-description"
        >
            <Box>
                <div className="customized-modal-header">
                    <span className="customized-modal-header__modal-name">{props.name}</span>
                    <Button
                        className="customized-modal-header__btn-close-modal"
                        variant="contained"
                        onClick={props.handleClose}
                    >
                        <i className="fa-solid fa-xmark" style={{ fontSize: 15 }}></i>
                    </Button>
                </div>
                {props.children}
            </Box>
        </Modal>
    );
};