import React from "react";
import type { DraggableEventHandler } from "react-draggable";
import type {
  RndDragEvent,
  RndDragCallback,
  RndResizeCallback,
} from "react-rnd";

import { UserContext, UserInfo } from "../core/context/users";

import { TStickyNote } from "../models";

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
    const newX = d.x < 257 ? 257 : d.x;

    const newSN: TStickyNote = {
      id: id,
      x: newX,
      y: newY,
      groupID,
      width,
      height,
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

  const onDragStart: DraggableEventHandler = () => {
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
    const newY = position.y < 0 ? 0 : position.y;
    const newX = position.x < 257 ? 257 : position.x;

    const newSN: TStickyNote = {
      id,
      groupID,
      x: newX,
      y: newY,
      width,
      height,
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
      willSave: false,
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
