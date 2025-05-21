import React, { useRef, useLayoutEffect, useEffect, forwardRef } from "react";
import Quill from "quill";

export interface EditorProps {
  /**
   * Initial content to set in the editor.
   */
  defaultValue?: any;

  /**
   * Callback triggered on text changes.
   */
  onTextChange?: (...args: any[]) => void;

  /**
   * Callback triggered on selection changes.
   */
  onSelectionChange?: (...args: any[]) => void;
}

export const Editor = forwardRef<HTMLDivElement, EditorProps>(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container?.appendChild(
        container.ownerDocument.createElement("div"),
      );

      if (!container || !editorContainer) {
        return;
      }

      const quill = new Quill(editorContainer, {
        theme: "snow",
      });

      ref.current = quill;

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        ref.current = null;
        container.innerHTML = "";
      };
    }, [ref]);

    return <div ref={containerRef}></div>;
  },
);
