import React from "react";

import { UserContext } from "../../core/context/users";

import { TStickyNote } from "../../models";
import { StickyNote } from "../../core/components/stickyNote";
import { getNewSNID } from "../../utils/newID";

import { Sidebar, SidebarProps } from "../../components/SNboard/sidebar";
import { useSNFetcher, useBoard } from "../../hooks/SNboard";

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

export const Board = () => {
  const { uid, token, SNList, saveStickyNote, setSNList } = useBoard();
  React.useEffect(() => {
    if (SNList !== undefined) {
    }
    console.log(SNList);
    console.log("SNListに変化あり");
  }, [SNList]);
  // const [SNList, setSNList] = React.useState<TStickyNote[]>(undefined);
  const [savedCount, setSavedCount] = React.useState(0);

  const [currentGroup, setCurrentGroup] = React.useState<
    SidebarProps["currentGroup"]
  >({
    id: "",
    label: "",
  });
  const [SNGroupList, setSNGroupList] =
    React.useState<SidebarProps["SNGroupList"]>(undefined);
  const changeGroupName = ({ id, label }) => {
    console.log(id, label);
    setSNGroupList((v) =>
      v.map((x) => {
        if (x.id === id) return { ...x, label };
        return x;
      })
    );
  };
  const [maxZIndex, setMaxZIndex] = React.useState(0);

  const handleGroupNameOnBlur = ({ groupID, groupLabel }) => {
    updateGroup({ uid, token, groupID, groupLabel });
  };

  useInterval({
    onUpdate: () => {
      saveStickyNote();
    },
  });
  React.useEffect(() => {
    (async () => {
      // const _snList: TStickyNote[] = await getSN({ uid, token });
      const _groupList = await getGroup({ uid, token });
      // setSNList(
      //   _snList.map((v) => ({
      //     id: v.id,
      //     groupID: v.groupID,
      //     x: v.x,
      //     y: v.y,
      //     zIndex: 2,
      //     width: v.width,
      //     height: v.height,
      //     value: v.value,
      //     willSave: false,
      //   }))
      // );
      setSNGroupList(
        _groupList.map((v) => ({
          id: v.id,
          label: v.label,
        }))
      );
      if (_groupList.length !== 0) {
        setCurrentGroup({ id: _groupList[0].id, label: _groupList[0].label });
      }
      // const _SNList = await getMySN({ uid: userInfo.uid })
      // setSNList(_SNList)
      // setMaxZIndex(Math.max(..._SNList.map((v) => v.zIndex)))
    })();

    // setInterval(saveStickyNote, 7000, SNList)
  }, []);

  console.log(SNList);
  const isLoading = [SNGroupList, SNList].some((v) => v === undefined);
  return isLoading ? (
    <Loading />
  ) : (
    <HOme
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

const HOme = ({
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

  const handleCreateGroup = async () => {
    const g = await createGroup({ uid, token });
    console.log(g.result);
    const newGroup = g.result;
    setSNGroupList((v) => [...v, newGroup]);
  };
  const handleCreateSN = () => {
    const newSN: TStickyNote = {
      id: getNewSNID(),
      groupID: currentGroup.id,
      value:
        '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
      width: "200px",
      height: "200px",
      x: 20,
      y: 100,
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
              {...{ ...props, setSNList, setMaxZIndex, maxZIndex, info: st }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Board;

const StickyNoteMemo = (
  props: TStickyNote & {
    info: TStickyNote;
    setSNList: React.Dispatch<React.SetStateAction<TStickyNote[]>>;
    setMaxZIndex: React.Dispatch<React.SetStateAction<number>>;
    maxZIndex: number;
  }
) => {
  const Memo = React.useMemo(() => {
    return <StickyNote {...{ ...props }} />;
  }, [JSON.stringify(props)]);
  return <>{Memo}</>;
};

const useInterval = ({ onUpdate }) => {
  const onUpdateRef = React.useRef(() => {});
  React.useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);
  React.useEffect(() => {
    const timerId = setInterval(() => onUpdateRef.current(), 5000);
    return () => clearInterval(timerId);
  }, []);
};
