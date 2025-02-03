"use client";
import React, { useMemo, useState, useCallback } from "react";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { createEditor, Descendant, BaseEditor } from "slate";
import { withHistory } from "slate-history";

// Define custom types for plain text
type CustomElement = {
  type: "paragraph";
  children: CustomText[];
};

type CustomText = {
  text: string;
};

// Extend Slate's custom types
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

interface SlateEditorProps {
  onSubmit: (content: string) => void;
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const SlateEditor = ({ onSubmit }: SlateEditorProps) => {
  const editor = useMemo(() => withReact(withHistory(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [focused, setFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      setValue(newValue);
      const { selection } = editor;
      if (selection && focused) {
        ReactEditor.focus(editor);
      }
    },
    [editor, focused]
  );

  const renderElement = useCallback((props: any) => {
    return <p {...props.attributes}>{props.children}</p>;
  }, []);

  const handleSubmit = () => {
    const content = value
      .map((node) => (node as any).children[0].text)
      .join("\n")
      .trim();

    if (content) {
      onSubmit(content);
      setValue(initialValue);
    }
  };

  return (
    <div>
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        <Editable
          renderElement={renderElement}
          placeholder="Leave a comment if you'd like"
          className="border border-gray-300 p-2 h-40 relative"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Slate>
      <button
        onClick={handleSubmit}
        className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
      >
        Submit Comment
      </button>
    </div>
  );
};

export default SlateEditor;
