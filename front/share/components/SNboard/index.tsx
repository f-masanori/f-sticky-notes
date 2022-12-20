import React from "react";

import { UserContext } from "../../core/context/users";

import { TStickyNote } from "../../models";
import { StickyNote } from "../../core/components/stickyNote";
import { getNewSNID } from "../../utils/newID";

import { Sidebar, SidebarProps } from "../../components/SNboard/sidebar";
import { useBoard } from "../../hooks/SNboard";

import {
  createSN,
  getSN,
  updateSN,
  createGroup,
  getGroup,
  updateGroup,
} from "../../repository/stickyNotes";
import { Loading } from "../../core/uiComponents/Loading";

// TODO: useBoardを作って作ってカスタムフックにし無駄なレンダリングをなくす

export const BoardContainer = () => {
  const {
    uid,
    token,
    SNList,
    saveStickyNote,
    setSNList,
    changeGroupName,
    setSNGroupList,
    setCurrentGroup,
    SNGroupList,
    currentGroup,
  } = useBoard();

  const [maxZIndex, setMaxZIndex] = React.useState(0);

  const handleGroupNameOnBlur = ({ groupID, groupLabel }) => {
    updateGroup({ uid, token, groupID, groupLabel });
  };

  useInterval({
    onUpdate: () => {
      saveStickyNote();
    },
    ms: 2000,
  });

  React.useEffect(() => {
    (async () => {
      const _groupList = await getGroup({ uid, token });
      setSNGroupList(
        _groupList.map((v) => ({
          id: v.id,
          label: v.label,
        }))
      );
      if (_groupList.length !== 0) {
        setCurrentGroup({ id: _groupList[0].id, label: _groupList[0].label });
      }
    })();
  }, []);

  const isLoading = [SNGroupList, SNList].some((v) => v === undefined);
  return isLoading ? (
    <Loading />
  ) : (
    <Board
      {...{
        SNList,
        setSNList,
        setMaxZIndex,
        maxZIndex,
        SNGroupList,
        currentGroup,
        setCurrentGroup,
        changeGroupName,
        handleGroupNameOnBlur,
        setSNGroupList,
      }}
    />
  );
};

const Board = ({
  SNList,
  setSNList,
  setMaxZIndex,
  maxZIndex,
  SNGroupList,
  currentGroup,
  setCurrentGroup,
  changeGroupName,
  handleGroupNameOnBlur,
  setSNGroupList,
}: {
  SNList: TStickyNote[];
  setSNList: React.Dispatch<React.SetStateAction<TStickyNote[]>>;
  setMaxZIndex: React.Dispatch<React.SetStateAction<number>>;
  maxZIndex: number;
  SNGroupList: SidebarProps["SNGroupList"];
  currentGroup: SidebarProps["currentGroup"];
  setCurrentGroup;
  changeGroupName;
  handleGroupNameOnBlur;
  setSNGroupList: React.Dispatch<
    React.SetStateAction<SidebarProps["SNGroupList"]>
  >;
}) => {
  const uid = React.useContext(UserContext).userInfo.uid;
  const token = React.useContext(UserContext).userInfo.token;
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isAppleMode, setIsAppleMode] = React.useState(true);

  const handleCreateGroup = async () => {
    const g = await createGroup({ uid, token });
    const newGroup = g.result;
    setSNGroupList((v) => [...v, newGroup]);
  };
  const handleCreateSN = () => {
    const newSN: TStickyNote = {
      id: getNewSNID(), //TODO: サーバーサイドで付番する
      groupID: currentGroup.id,
      value:
        '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
      width: "200px",
      height: "200px",
      x: 200,
      y: 400,
      zIndex: 0,
      willSave: false,
    };
    createSN({
      uid,
      token,
      st: newSN,
    });
    setSNList((v) => [...v, newSN]);
  };
  const handleGroupLabelOnClick = (p: SidebarProps["currentGroup"]) =>
    setCurrentGroup(p);

  const shownSNList = SNList.filter((v) => v.groupID === currentGroup.id);
  return (
    <div className="mt-16 flex flex-row">
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
      <div>
        <button
          onClick={handleCreateSN}
          className="z-[10000] fixed right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          付箋追加
        </button>
        <div className="z-[10000] fixed right-6 mt-10 font-bold">
          <div>りんごモード</div>
          <input
            type="checkbox"
            checked={isAppleMode}
            className="peer sr-only"
          />
          <span
            onClick={(e) => {
              setIsAppleMode(!isAppleMode);
            }}
            className="block w-[2em] cursor-pointer bg-gray-500 rounded-full 
      p-[1px] after:block after:h-[1em] after:w-[1em] after:rounded-full 
      after:bg-white after:transition peer-checked:bg-blue-500 
      peer-checked:after:translate-x-[calc(100%-2px)]"
          ></span>
          {/* {{ isCheck }} */}
        </div>
        {shownSNList.map((st) => {
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

export default BoardContainer;

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

const useInterval = ({
  onUpdate,
  ms,
}: {
  onUpdate: () => void;
  ms?: number;
}) => {
  const onUpdateRef = React.useRef(() => {});
  React.useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);
  React.useEffect(() => {
    const timerId = setInterval(() => onUpdateRef.current(), ms || 5000);
    return () => clearInterval(timerId);
  }, []);
};
