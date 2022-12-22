import React from "react";

import { TStickyNote } from "../../models";
import { StickyNote } from "../../core/components/stickyNote";
import { Sidebar } from "../../components/SNboard/sidebar";
import { useBoard } from "../../hooks/SNboard";

export const BoardContainer = () => {
  const {
    state: { SNGroupList, maxZIndex, isAppleMode, isSidebarOpen, currentGroup },
    setSNList,
    changeGroupName,
    onClickAppleModeToggle,
    setMaxZIndex,
    handleGroupNameOnBlur,
    setIsSidebarOpen,
    handleCreateGroup,
    handleGroupLabelOnClick,
    handleCreateSN,
    shownSNList,
  } = useBoard();

  return (
    <div className="mt-16 flex flex-row">
      <div className="w-64 h-full fixed z-[9999999]">
        <Sidebar
          {...{
            isSidebarOpen,
            setIsSidebarOpen,
            SNGroupList,
            createGroup: handleCreateGroup,
            handleGroupLabel: handleGroupLabelOnClick,
            currentGroup,
            changeGroupName,
            handleGroupNameOnBlur,
          }}
        />
        <div className="z-[10000] font-bold flex flex-row ml-1">
          <div className="mr-2">りんごモード</div>
          <div>
            <input
              type="checkbox"
              checked={isAppleMode}
              className="peer sr-only"
            />
            <span
              onClick={onClickAppleModeToggle}
              className="block w-[2em] cursor-pointer bg-gray-500 rounded-full 
      p-[1px] after:block after:h-[1em] after:w-[1em] after:rounded-full 
      after:bg-white after:transition peer-checked:bg-blue-500 
      peer-checked:after:translate-x-[calc(100%-2px)] mt-[0.25em]"
            ></span>
          </div>
        </div>
      </div>
      <div>
        <button
          onClick={handleCreateSN}
          className="z-[10000] fixed right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          付箋追加
        </button>
        {(shownSNList || []).map((st) => {
          const props: TStickyNote = {
            id: st.id,
            groupID: st.groupID,
            x: st.x,
            y: st.y,
            value: st.value,
            width: st.width,
            height: st.height,
            zIndex: st.zIndex,
            willSave: st.willSave,
          };
          return (
            <StickyNoteMemo
              key={st.id}
              {...{
                ...props,
                setSNList,
                setMaxZIndex,
                maxZIndex,
                info: st,
                isAppleMode,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const StickyNoteMemo = (
  props: TStickyNote & {
    info: TStickyNote;
    setSNList: React.Dispatch<React.SetStateAction<TStickyNote[]>>;
    setMaxZIndex: React.Dispatch<React.SetStateAction<number>>;
    maxZIndex: number;
    isAppleMode: boolean;
  }
) => {
  const Memo = React.useMemo(() => {
    return <StickyNote {...{ ...props }} />;
  }, [JSON.stringify(props)]);
  return <>{Memo}</>;
};
