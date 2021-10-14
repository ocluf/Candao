import React, { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { FiMenu, FiX } from "react-icons/fi";
import { LoginState, useAuth } from "./AuthProvider";
import { useDaoInfo } from "../hooks/useDaoInfo";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const userNavigation = [
  // { name: "Your Profile", href: "#" },
  // { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Members", href: "#", current: false },
  { name: "Canisters", href: "#", current: false },
  { name: "Proposals", href: "#", current: false },
];

export const Nav: React.FC = ({}) => {
  const { authState, logout, login } = useAuth();

  const { daoInfo, daoInfoError, daoInfoLoading } = useDaoInfo();

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }: { open: boolean }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <img className="h-8 w-8" src="/images/logo.svg" alt="" />
                  <span className="pl-2 text-white font-semibold">CanDAO</span>
                </div>
                {authState === LoginState.LoggedIn && (
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-200 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() =>
                      authState === LoginState.LoggedIn ? logout() : login()
                    }
                  >
                    {authState === LoginState.LoggedIn ? "Log out" : "Log in"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};
