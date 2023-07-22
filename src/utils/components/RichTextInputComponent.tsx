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
};

export default function RichTextInputComponent(props: RichTextInputComponentProps) {
  const useStyles = makeStyles({
    root: {
      width: "100%",

      "& .quill": {
        margin: "0 8px",

        "& .ql-toolbar": {
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
        },
        "& .ql-container": {
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          overflow: "hidden",
          border: props.readOnly ? "unset" : "1px solid #ccc",

        },
        "& .ql-editor": {
          minHeight: 200,
          // maxHeight: 600,
          overflow: "auto",
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
        readOnly={props.readOnly}
      />
    </div>
  );
};