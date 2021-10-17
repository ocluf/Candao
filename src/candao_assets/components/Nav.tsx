import { Disclosure } from "@headlessui/react";
import classNames from "classnames";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import React from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useDaoInfo } from "../hooks/useDaoInfo";
import { LoginState, useAuth } from "./AuthProvider";

type Tab = "Dashboard" | "Members" | "Canisters" | "Proposals";
type NavInfo = { name: Tab, href: string, route: string }


const navigation: Array<NavInfo> = [
  { name: "Dashboard", href: "#", route: "/dao" },
  { name: "Members", href: "#", route: "/members" },
  { name: "Canisters", href: "#", route: "/canisters" },
  { name: "Proposals", href: "#", route: "/proposals" },
];

export const Nav: React.FC<{ current?: Tab, showMenu?: boolean }> = ({ current, showMenu = true }) => {
  const { authState, logout, login } = useAuth();
  const { daoInfo, daoInfoError, daoInfoLoading } = useDaoInfo();
  const router = useRouter();

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }: { open: boolean }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link passHref href="/">
                  <a className="flex-shrink-0 flex items-center">
                    <img className="h-8 w-8" src="/images/logo.svg" alt="" />
                    <span className="pl-2 text-white font-semibold">
                      CanDAO
                    </span>
                  </a>
                </Link>
                {showMenu && (
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={() => router.push(item.route)}
                          className={classNames(
                            current == item.name
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium"
                          )}
                          aria-current={current ? "page" : undefined}
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
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <FiX className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <FiMenu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    current == item.name
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={current ? "page" : undefined}
                >
                  {item.name}
                </a>
              ))}
              <button
                className={
                  "w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                }
                onClick={logout}
              >
                Log out
              </button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
