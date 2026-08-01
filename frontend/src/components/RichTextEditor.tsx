"use client";

import Editor, { type ContentEditableEvent } from "react-simple-wysiwyg";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  function handleChange(event: ContentEditableEvent) {
    onChange(event.target.value);
  }

  return <Editor value={value} onChange={handleChange} placeholder={placeholder} />;
}
