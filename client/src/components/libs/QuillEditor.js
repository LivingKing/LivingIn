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
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "image",
    "video",
    "file",
    "link",
    "code-block",
    "video",
    "blockquote",
    "clean",
  ];
}

export default QuillEditor;
