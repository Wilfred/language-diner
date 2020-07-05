import "codemirror/addon/selection/active-line";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/mode/simple";

import CodeMirror from "codemirror";
import React from "react";
import { commentRegexp } from "./parsing";
import equal from "fast-deep-equal";

function defineLangplzMode(commentPrefix) {
  CodeMirror.defineSimpleMode("langplz", {
    start: [
      { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
      { regex: commentRegexp(commentPrefix), token: "comment" }
    ]
  });
}

// Wraps a textarea with a CodeMirror attached. I tried the library
// react-codemirror2, but we need precise control of modes defined.
class CodeMirrorTag extends React.Component {
  constructor(props) {
    super(props);
    this.textArea = React.createRef();
    this.editor = null;
    this.marker = null;
  }
  componentDidMount() {
    defineLangplzMode(this.props.commentPrefix);
    this.editor = CodeMirror.fromTextArea(this.textArea.current, {
      lineNumbers: true,
      matchBrackets: true,
      styleActiveLine: true,
      mode: "langplz"
    });
    this.editor.on("change", () => {
      this.props.onChange(this.editor.getValue());
    });
    this.setMarker(this.props.errorRange);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.commentPrefix != this.props.commentPrefix) {
      defineLangplzMode(this.props.commentPrefix);
      this.editor.setOption("mode", "langplz");
    }
    if (!equal(prevProps.errorRange, this.props.errorRange)) {
      this.setMarker(this.props.errorRange);
    }
  }
  setMarker(errorRange) {
    if (this.marker !== null) {
      this.marker.clear();
      this.marker = null;
    }
    if (errorRange !== null) {
      this.marker = this.editor.markText(errorRange[0], errorRange[1], {
        className: "syntax-error",
        title: "foo",
        css: "border-bottom: 2px dotted red;"
      });
    }
  }
  render() {
    return (
      <textarea ref={this.textArea} defaultValue={this.props.initialValue} />
    );
  }
}

module.exports = CodeMirrorTag;
