import React, { useState } from "react";

function LexerOptions(_props) {
  const [prefix, setPrefix] = useState(";");

  return (
    <div className="field">
      <label className="label">Comments</label>
      <div className="control">
        <input
          id="comment"
          className="input"
          type="text"
          placeholder="Comment character"
          value={prefix}
          onChange={e => setPrefix(e.target.value)}
        />
      </div>
      <p className="help">Prefix character for single line comments</p>
    </div>
  );
}

module.exports = LexerOptions;
