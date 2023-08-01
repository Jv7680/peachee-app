import { makeStyles } from "@mui/styles";
import { useMemo } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextInputComponentProps {
  error?: any;
  onChange?: any;
  onBlur?: any;
  placeholder?: any;
  value: any;
  touched?: any;
  readOnly?: boolean;
  disabled?: boolean;
};

export default function RichTextInputComponent(props: RichTextInputComponentProps) {
  const useStyles = makeStyles({
    root: {
      width: "100%",
      flex: 1,
      overflow: 'auto',

      "& .quill": {
        margin: "0 8px",
        height: '100%',
        display: 'flex',
        flexDirection: 'column',

        "& .ql-toolbar": {
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
        },
        "& .ql-container": {
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          overflow: "hidden",
          border: props.readOnly ? "unset" : "1px solid #ccc",
          flex: 1,
        },
        "& .ql-editor": {
          overflow: "auto",
          margin: '12px 5px 12px 15px',
          padding: "0 8px 0 0",
          // - margin top and bottom (24px)
          height: "calc(100% - 24px)",
          "@media only screen and (max-width: 510px)": {
            // height: 386,
          }
        },
      },
    },
    errorContainer: {
      marginTop: 7,
    },
    textErr: {
      color: "red",
      fontSize: "12px",
      lineHeight: "22px",
    },
  });

  const classes = useStyles();

  const modules = useMemo(() => {
    return ({
      toolbar: props.readOnly ? false : {
        container: [
          [{ size: [] }],
          ['bold', 'italic', 'underline'],
          [
            { 'list': 'ordered' },
            { 'list': 'bullet' },
          ],
          [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        ]
      },
      clipboard: {
        matchVisual: false
      }
    });
  }, [props.readOnly]);

  const formats = [
    'header', 'font', 'size', 'align',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'width', 'height', 'float', 'style'
  ];

  return (
    <div className={classes.root}>
      <ReactQuill
        theme="snow"
        onChange={props.onChange}
        // onBlur={onBlur}
        value={props.value}
        modules={modules}
        formats={formats}
        placeholder={props.placeholder}
        readOnly={props.disabled}
      />
    </div>
  );
};