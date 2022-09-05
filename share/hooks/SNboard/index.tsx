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
    console.log({ saveTarget });
    saveTarget.forEach((v) => {
      updateSN({ st: v, uid, token });
    });
    setSNList((v) => {
      return v.map((x) => ({ ...x, willSave: false }));
    });
    setSavedCount((v) => v + 1);
  };

  return { uid, token, SNList, saveStickyNote, setSNList };
};
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_PROD;

const fetcher = (url: string, args: GetSNProps) => {
  return fetch(url + "/stickyNote", {
    method: "GET",
    mode: "cors", // no-cors, *cors, same-origin
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer",
    headers: {
      "Content-Type": "application/json",
      uid: args.uid,
      token: args.token,
    },
  })
    .then((res) => {
      return res.json();
    })
    .catch((e) => {
      console.error(e);
    });
};

export const useSNFetcher = ({ uid, token }: GetSNProps) => {
  // TODO: エラーハンドリング
  const { data, error } = useSWR([baseUrl, { uid, token }], fetcher);
  return data;
};
