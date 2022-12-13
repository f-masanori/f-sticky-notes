import React from "react";
import { IoIosSettings } from "react-icons/io";
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
}: TStickyNote & {
  info: TStickyNote;
  setSNList: React.Dispatch<React.SetStateAction<TStickyNote[]>>;
  setMaxZIndex: React.Dispatch<React.SetStateAction<number>>;
  maxZIndex: number;
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
      onClick={() => {
        console.log(1);
        setMaxZIndex((v) => v + 1);
        setSNList((v) =>
          v.map((x) => {
            if (x.id === id) return { ...x, zIndex: maxZIndex + 1 };
            return x;
          })
        );
      }}
    >
      <div>
        <div className={`handle ${snHeaderColor} h-4`}>
          <div></div>
        </div>

        <LexiEditer
          onChange={(newValue: string) => {
            console.log("onchange");
            setSNList((v) =>
              v.map((sn) => {
                if (sn.id === id)
                  return { ...sn, value: newValue, willSave: true };
                return sn;
              })
            );
          }}
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
      </div>
    </Rnd>
  );
};

const addPx = (a: string, b: string): string => {
  const res = Number(a.replace("px", "")) + Number(b.replace("px", ""));
  return String(res) + "px";
};
