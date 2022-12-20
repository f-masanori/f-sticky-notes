import React from "react";
import { Rnd } from "react-rnd";

import LexiEditer from "./lexical";
import { useStickyNote } from "../../hooks/stickyNote";

import { UserContext } from "../../core/context/users";

import { TStickyNote } from "../../models";

export const StickyNote = ({
  info,
  id,
  x,
  y,
  value,
  width,
  height,
  setSNList,
  zIndex,
  setMaxZIndex,
  maxZIndex,
  isAppleMode,
}: TStickyNote & {
  info: TStickyNote;
  setSNList: React.Dispatch<React.SetStateAction<TStickyNote[]>>;
  setMaxZIndex: React.Dispatch<React.SetStateAction<number>>;
  maxZIndex: number;
  isAppleMode: boolean;
}) => {
  const userInfo = React.useContext(UserContext).userInfo;

  const {
    onDragStop,
    onResizeStop,
    onResizing,
    onDragStart,
    TARef,
    onFocus,
    isFocus,
    onClick,
    onChange,
  } = useStickyNote({
    sn: {
      id,
      x,
      y,
      groupID: info.groupID,
      width,
      height,
      zIndex,
      value,
      willSave: info.willSave,
    },
    setSNList,
    userInfo,
    setMaxZIndex,
    maxZIndex,
  });
  const snColor = "bg-cyan-200";
  const snHeaderColor = "bg-cyan-300";
  return (
    <Rnd
      dragHandleClassName={"handle"}
      className={`w-40 h-10 rounded ${snColor} border border-slate-300 shadow-xl z-[${zIndex}]`}
      style={{
        zIndex,
      }}
      size={{ width, height }}
      position={{ x, y }}
      minHeight={"15px"}
      minWidth="20"
      onResizeStop={onResizeStop}
      onResize={onResizing}
      onDragStop={onDragStop}
      onDragStart={onDragStart}
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      onClick={onClick}
    >
      {isAppleMode ? (
        <div>
          <div
            className={`handle ${snHeaderColor} h-4 flex justify-end align-middle`}
          >
            <div className={`h-2 w-2 mt-1 mr-1 bg-orange-500`}></div>
          </div>
        </div>
      ) : (
        <div>
          <div className={`handle ${snHeaderColor} h-4`}></div>
        </div>
      )}
      <LexiEditer
        onChange={onChange}
        isAppleMode={isAppleMode}
        initValue={value}
        containerProps={{
          style: {
            resize: "none",
            width: addPx(width, "-8px"),
            height: addPx(height, "-72px"),
            border: "0px",
            outline: "none",
            zIndex: 1,
            overflowY: "scroll",
          },
        }}
      />
    </Rnd>
  );
};

const addPx = (a: string, b: string): string => {
  const res = Number(a.replace("px", "")) + Number(b.replace("px", ""));
  return String(res) + "px";
};
