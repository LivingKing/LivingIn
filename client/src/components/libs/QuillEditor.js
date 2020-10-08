import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

class QuillEditor extends React.Component {
  render() {
    return (
      <ReactQuill
        theme={"snow"}
        onChange={this.handleChange}
        modules={this.modules}
        formats={this.formats}
        placeholder={this.props.placeholder}
      />
    );
  }

  modules = {
    syntax: false,
    toolbar: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: ["small", false, "large", "huge"] }, { color: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        { align: [] }
      ],
      ["link", "image", "video"],
      ["clean"]
    ],
  };

  formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "size",
    "color",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
    "clean"
  ];
}

export default QuillEditor;
