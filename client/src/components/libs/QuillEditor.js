import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const QuillEditor = (props) =>{
  const [editorHtml, setEditorHtml] = useState("");
  const onHandleChange= (value)=>{
    setEditorHtml(value);
    props.onTextChange(value);
  }
  const modules = {
    toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ]
;
    return (
      <ReactQuill
        theme={"snow"}
        onChange={onHandleChange}
        value={editorHtml}
        modules={modules}
        formats={formats}
        placeholder={props.placeholder}
      />
    );

}

export default QuillEditor;
