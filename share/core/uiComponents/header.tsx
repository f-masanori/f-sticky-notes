import Link, { LinkProps } from "next/link";
import PropTypes from "prop-types";
import { UserContext, UserInfo, UserProvider } from "../../core/context/users";

import React from "react";

export const Header = ({
  // userInfo,
  clickLogout,
  clickLogin,
}: {
  // userInfo: UserInfo
  clickLogout: () => void;
  clickLogin: () => void;
}) => {
  const userInfo = React.useContext(UserContext).userInfo;
  const LogindLabel = userInfo.uid === "" ? "ログイン" : "ログアウト";
  const loginout = userInfo.uid === "" ? clickLogin : clickLogout;

  return (
    <header className=" bg-cyan-500 text-gray-600 body-font fixed inset-x-0 top-0 z-[9999999] w-full">
      <div className="flex flex-wrap p-2 flex-col md:flex-row justify-between  w-full">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className={`w-10 h-10 text-white p-2 bg-indigo-500 rounded-full`}
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="ml-3 text-xl">Sticky Note</span>
        </a>
        <div className="flex flex-row">
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <Link href="/SNboard">
              <a className="mr-5 hover:text-gray-900">付箋ボード</a>
            </Link>
          </nav>
          <button
            onClick={loginout}
            className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
          >
            {LogindLabel}
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
