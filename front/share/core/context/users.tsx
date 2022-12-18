import React from "react";

export type UserInfo = {
  uid: string;
  email: string;
  token?: string;
};

export type TUserContext = {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<UserInfo>;
};

export const createUserContext = ({
  uid,
  email,
}: {
  uid: string;
  email: string;
}) => {
  return React.createContext<TUserContext>({
    userInfo: { uid, email },
    setUserInfo: () => {},
  });
};

export const UserContext = React.createContext<TUserContext>({
  userInfo: { uid: "", email: "" },
  setUserInfo: () => {},
});

type UserProviderProps = {
  children: React.ReactNode;
  uid: string;
  email: string;
};

export const UserProvider: React.FC<UserProviderProps> = ({
  children,
  uid,
  email,
}) => {
  const [userInfo, setUserInfo] = React.useState<UserInfo>({
    uid: uid,
    email,
  });
  React.useEffect(() => {
    setUserInfo({ uid, email });
  }, [uid, email]);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
