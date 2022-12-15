import React from "react";
import useSWR from "swr";

import { TStickyNote } from "../../models";

import { UserContext } from "../../core/context/users";
import {
  createSN,
  getSN,
  updateSN,
  createGroup,
  getGroup,
  updateGroup,
} from "../../repository/stickyNotes";
import { Sidebar, SidebarProps } from "../../components/SNboard/sidebar";
import { backendApi } from "../../repository/common";

export type GetSNProps = {
  uid: string;
  token: string;
};

export const useBoard = () => {
  const userInfo = React.useContext(UserContext).userInfo;
  const uid = userInfo.uid;
  const token = userInfo.token;
  const data = useSNFetcher({ uid, token });
  React.useEffect(() => {
    if (data !== undefined) {
      setSNList(data.result);
    }
  }, [data]);
  const [SNList, setSNList] = React.useState<TStickyNote[]>(undefined);
  const [savedCount, setSavedCount] = React.useState(0);

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

  React.useEffect(() => {
    if (SNList !== undefined) {
    }
  }, [SNList]);

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

  return {
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
  };
};

export const useSNFetcher = ({ uid, token }: GetSNProps) => {
  // TODO: エラーハンドリング
  const { data, error } = useSWR(
    ["/stickyNote", { uid, token }],
    backendApi("/stickyNote", uid, token).GET
  );
  return data;
};
