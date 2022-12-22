import React from "react";

import { TStickyNote } from "../../models";

import { UserContext } from "../../core/context/users";
import { updateSN, getGroup, updateGroup } from "../../repository/stickyNotes";
import { SidebarProps } from "../../components/SNboard/sidebar";
import { backendApi } from "../../repository/common";

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

  React.useEffect(() => {
    (async () => {
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

  return {
    uid,
    token,
    SNList,
    setSNList,
    changeGroupName,
    setSNGroupList,
    setCurrentGroup,
    SNGroupList,
    currentGroup,
    setMaxZIndex,
    maxZIndex,
    handleGroupNameOnBlur,
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
