import React from "react";

import { TStickyNote } from "../../models";

import { UserContext } from "../../core/context/users";
import { updateSN, getGroup, updateGroup } from "../../repository/stickyNotes";
import { SidebarProps } from "../../components/SNboard/sidebar";
import { backendApi } from "../../repository/common";
import { createSN, createGroup } from "../../repository/stickyNotes";
import { getNewSNID } from "../../utils/newID";

export type GetSNProps = {
  uid: string;
  token: string;
};

export const useBoard = () => {
  const userInfo = React.useContext(UserContext).userInfo;
  const uid = userInfo.uid;
  const token = userInfo.token;
  const [SNList, setSNList] = React.useState<TStickyNote[]>(undefined);
  const [savedCount, setSavedCount] = React.useState(0);
  const [currentGroup, setCurrentGroup] = React.useState<
    SidebarProps["currentGroup"]
  >({
    id: "",
    label: "",
  });
  const [SNGroupList, setSNGroupList] =
    React.useState<SidebarProps["SNGroupList"]>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isAppleMode, setIsAppleMode] = React.useState(true);
  const [maxZIndex, setMaxZIndex] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      console.log(uid);
      const data = await backendApi(uid, token).GET("/stickyNote");
      setSNList(data.result);
    })();
  }, []);

  const saveStickyNote = () => {
    // Note:最初の変更はLexicalに初期値が代入されたことによるもののためスキップ
    if (savedCount === 0) {
      setSavedCount(1);
      return;
    }

    const saveTarget = SNList.filter((v) => v.willSave);
    if (saveTarget.length !== 0) {
      saveTarget.forEach((v) => {
        updateSN({ st: v, uid, token });
      });
      setSNList((v) => {
        return v.map((x) => ({ ...x, willSave: false }));
      });
      setSavedCount((v) => v + 1);
    }
  };

  const changeGroupName = ({ id, label }) => {
    setSNGroupList((v) =>
      v.map((x) => {
        if (x.id === id) return { ...x, label };
        return x;
      })
    );
  };

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

  const shownSNList = (SNList || []).filter(
    (v) => v.groupID === currentGroup.id
  );

  const onClickAppleModeToggle = () => setIsAppleMode(!isAppleMode);
  return {
    setSNList,
    changeGroupName,
    setMaxZIndex,
    handleGroupNameOnBlur,
    setIsSidebarOpen,
    handleCreateGroup,
    handleGroupLabelOnClick,
    handleCreateSN,
    onClickAppleModeToggle,
    shownSNList,
    state: {
      SNGroupList,
      maxZIndex,
      isAppleMode,
      isSidebarOpen,
      currentGroup,
    },
  };
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
