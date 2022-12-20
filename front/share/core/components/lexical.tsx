import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import {
  $getListDepth,
  $isListItemNode,
  $isListNode,
  ListItemNode,
  ListNode,
} from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import {
  $getRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  INDENT_CONTENT_COMMAND,
  COMMAND_PRIORITY_HIGH,
  EditorState,
  LexicalEditor,
} from "lexical";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import ToolbarPlugin from "./lexicalPlugins/ToolbarPlugin";
import TableCellActionMenuPlugin from "./lexicalPlugins/TableActionMenuPlugin";
import TableCellResizer from "./lexicalPlugins/TableCellResizer";
import TableOfContentsPlugin from "./lexicalPlugins/TableOfContentsPlugin";
import React from "react";
import { useEffect } from "react";
import AutoLinkPlugin from "../../core/components/lexicalPlugins/AutoLinkPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "text-[28px] font-bold",
    h2: "text-[24px] font-semibold",
    h3: "text-[20px] font-medium",
    h4: "text-[16px]",
    h5: "text-[12px]",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    overflowed: "editor-text-overflowed",
    hashtag: "editor-text-hashtag",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    underlineStrikethrough: "editor-text-underlineStrikethrough",
    code: "editor-text-code",
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
  table: "border-collapse",
  tableCell: "overflow-y-auto border border-solid border-black",
  tableCellHeader: "bg-slate-200",
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
  console.error(error);
}

const Editor = ({
  containerProps,
  initValue,
  onChange: _onChange,
  isAppleMode,
}: {
  containerProps: any;
  initValue: any;
  onChange: any;
  isAppleMode: boolean;
}) => {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
    onError,
    editorState: initValue,
  };

  const [isFirst, setIsFirst] = React.useState(true);
  return (
    <>
      <LexicalComposer initialConfig={initialConfig}>
        {isAppleMode ? null : <ToolbarPlugin />}
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable {...containerProps} className="editor-input" />
            }
            placeholder={""}
          />
          <OnChangePlugin
            onChange={(editorState: EditorState, editor: LexicalEditor) => {
              if (isFirst) {
                setIsFirst(false);
                return;
              }
              _onChange(JSON.stringify(editorState));
            }}
            ignoreInitialChange={true}
            ignoreSelectionChange={true}
          />
          <TablePlugin />
          <TableCellActionMenuPlugin />
          <TableCellResizer />
          <ListPlugin />
          <AutoFocusPlugin />
          <HistoryPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={4} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </LexicalComposer>
    </>
  );
};
export default Editor;

function getElementNodesInSelection(selection) {
  const nodesInSelection = selection.getNodes();

  if (nodesInSelection.length === 0) {
    return new Set([
      selection.anchor.getNode().getParentOrThrow(),
      selection.focus.getNode().getParentOrThrow(),
    ]);
  }

  return new Set(
    nodesInSelection.map((n) => ($isElementNode(n) ? n : n.getParentOrThrow()))
  );
}

function isIndentPermitted(maxDepth) {
  const selection = $getSelection();

  if (!$isRangeSelection(selection)) {
    return false;
  }

  const elementNodesInSelection = getElementNodesInSelection(selection);

  let totalDepth = 0;

  for (const elementNode of elementNodesInSelection) {
    if ($isListNode(elementNode)) {
      totalDepth = Math.max($getListDepth(elementNode) + 1, totalDepth);
    } else if ($isListItemNode(elementNode)) {
      const parent = elementNode.getParent();
      if (!$isListNode(parent)) {
        throw new Error(
          "ListMaxIndentLevelPlugin: A ListItemNode must have a ListNode for a parent."
        );
      }

      totalDepth = Math.max($getListDepth(parent) + 1, totalDepth);
    }
  }

  return totalDepth <= maxDepth;
}

function ListMaxIndentLevelPlugin({ maxDepth }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INDENT_CONTENT_COMMAND,
      () => !isIndentPermitted(maxDepth ?? 7),
      COMMAND_PRIORITY_HIGH
    );
  }, [editor, maxDepth]);

  return null;
}
