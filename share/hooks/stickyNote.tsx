import React from "react";
import type { DraggableEventHandler } from "react-draggable";
import type {
  RndDragEvent,
  RndDragCallback,
  RndResizeCallback,
} from "react-rnd";

import { UserContext, UserInfo } from "share/core/context/users";

import { TStickyNote } from "share/models";
import { updateSN } from "share/repository/stickyNotes";

type UseStickyNoteProps = {
  sn: TStickyNote;
  setSNList: React.Dispatch<React.SetStateAction<TStickyNote[]>>;
  userInfo: UserInfo;
  setMaxZIndex;
  maxZIndex;
};

export const useStickyNote = ({
  sn: { value, x, y, id, width, height, zIndex, groupID },
  setSNList,
  userInfo,
  setMaxZIndex,
  maxZIndex,
}: UseStickyNoteProps) => {
  const TARef = React.useRef<HTMLTextAreaElement>(null);

  const [isFocus, setIsFocus] = React.useState(false);

  const onDragStop: DraggableEventHandler = (e, d) => {
    const newY = d.y < 0 ? 0 : d.y;

    if (d.x !== x || newY !== y) {
      const newSN: TStickyNote = {
        id: id,
        x: d.x,
        y: newY,
        groupID,
        width,
        height,
        value,
        zIndex: zIndex,
        willSave: false,
      };

      setSNList((v) =>
        v.map((sn) => {
          console.log(sn.id);
          console.log(id);

          if (sn.id === id) return { ...newSN };
          return sn;
        })
      );
    }
  };

  const onDragStart: DraggableEventHandler = () => {
    console.log(9);
    setMaxZIndex((v) => v + 1);
    setSNList((v) =>
      v.map((x) => {
        if (x.id === id) return { ...x, zIndex: maxZIndex + 1 };
        return x;
      })
    );
  };

  const onResizeStop: RndResizeCallback = (
    p,
    direction,
    ref,
    delta,
    position
  ) => {
    if (width !== ref.style.width || height !== ref.style.height) {
      const newSN: TStickyNote = {
        id,
        groupID,
        x,
        y,
        width: ref.style.width,
        height: ref.style.height,
        value,
        zIndex: zIndex,
        willSave: true,
      };

      setSNList((v) =>
        v.map((sn) => {
          if (sn.id === id) return { ...newSN };
          return sn;
        })
      );
    }
  };

  const onResizing: RndResizeCallback = (
    p,
    direction,
    ref,
    delta,
    position
  ) => {
    const newSN: TStickyNote = {
      id,
      groupID,
      x: position.x,
      y: position.y,
      width: ref.style.width,
      height: ref.style.height,
      value,
      zIndex: zIndex,
      willSave: true,
    };
    setSNList((v) =>
      v.map((sn) => {
        if (sn.id === id) return { ...newSN };
        return sn;
      })
    );
  };

  const onFocus = () => {
    setIsFocus(true);
  };

  return {
    onResizeStop,
    onResizing,
    onDragStart,
    onDragStop,
    TARef,
    onFocus,
    isFocus,
  };
};
