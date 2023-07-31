import { Badge, CircularProgress, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ReplayIcon from '@mui/icons-material/Replay';

import "./enhanced-table-toolbar.scss";

interface EnhancedTableToolbarProps {
    numSelected: number;
    title?: string;
    showFilterIcon?: boolean;
    disableFilterIcon?: boolean;
    filterIconTooltipText?: string;
    handleFilter?: any;
    deleteIconTooltipText?: string;
    handleDelete?: any;
    showAddIcon?: boolean;
    disableAddIcon?: boolean;
    addIconTooltipText?: string;
    handleAdd?: any;
    showSaveIcon?: boolean;
    disableSaveIcon?: boolean;
    saveIconTooltipText?: string;
    handleSave?: any;
    isSaveIconLoading?: boolean;
    showResetIcon?: boolean;
    disableResetIcon?: boolean;
    resetIconTooltipText?: string;
    handleReset?: any;
}

export default function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected } = props;

    return (
        <Toolbar
            className="enhanced-table-toolbar"
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && { bgcolor: "#ff00002b", }),
            }}
        >
            {
                numSelected > 0 ?
                    (
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            color="inherit"
                            variant="subtitle1"
                            component="div"
                        >
                            Đã chọn {numSelected}
                        </Typography>
                    )
                    :
                    (
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant="h6"
                            id="tableTitle"
                            component="div"
                        >
                            {props.title}
                        </Typography>
                    )
            }
            {
                numSelected > 0 ?
                    (
                        <Tooltip title={props.deleteIconTooltipText}>
                            <IconButton
                                className="btn-delete"
                                onClick={props.handleDelete}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )
                    :
                    (
                        <>
                            {
                                props.showFilterIcon &&
                                <Tooltip title={props.disableFilterIcon ? "" : props.filterIconTooltipText}>
                                    <IconButton
                                        className="btn-filter"
                                        disabled={props.disableFilterIcon}
                                        onClick={props.handleFilter}
                                    >
                                        <FilterListIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                            {
                                props.showResetIcon &&
                                <Tooltip title={props.disableResetIcon ? "" : props.resetIconTooltipText}>
                                    <IconButton
                                        className="btn-reset"
                                        disabled={props.disableResetIcon}
                                        onClick={props.handleReset}
                                    >
                                        <ReplayIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                            {
                                props.showSaveIcon &&
                                <Tooltip title={props.disableSaveIcon ? "" : props.saveIconTooltipText}>
                                    <IconButton
                                        className="btn-save"
                                        disabled={props.disableSaveIcon}
                                        onClick={props.handleSave}
                                    >
                                        {
                                            props.isSaveIconLoading ?
                                                <CircularProgress size={30} />
                                                :
                                                <>
                                                    {
                                                        props.disableSaveIcon ?
                                                            <SaveOutlinedIcon />
                                                            :
                                                            <Badge badgeContent={""} color="error" variant="dot">
                                                                <SaveOutlinedIcon />
                                                            </Badge>
                                                    }
                                                </>
                                        }
                                    </IconButton>
                                </Tooltip>
                            }
                            {
                                props.showAddIcon &&
                                <Tooltip title={props.disableAddIcon ? "" : props.addIconTooltipText}>
                                    <IconButton
                                        className="btn-add"
                                        disabled={props.disableAddIcon}
                                        onClick={props.handleAdd}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                        </>
                    )
            }
        </Toolbar>
    );
}