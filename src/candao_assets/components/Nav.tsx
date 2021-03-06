import { Disclosure } from "@headlessui/react";
import classNames from "classnames";
import Link from "next/link";
import React from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useCycleBalance } from "../hooks/useCycleBalance";
import { LoginState, useAuth } from "./AuthProvider";

type Tab = "Dashboard" | "Members" | "Canisters" | "Proposals";
type NavInfo = { name: Tab; href: string };

const navigation: Array<NavInfo> = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Members", href: "/members" },
  { name: "Canisters", href: "/canisters" },
  { name: "Proposals", href: "/proposals" },
];

export const Nav: React.FC<{ current?: Tab; showMenu?: boolean }> = ({
  current,
  showMenu = true,
}) => {
  const { authState, logout, login } = useAuth();
  const { cycleBalanceLoading, cycleBalanceError, cycleBalance } =
    useCycleBalance();

  const CycleBalance = () => {
    let balance;
    if (cycleBalanceLoading) {
      balance = "...";
    } else if (cycleBalanceError) {
      balance = "error";
    } else {
      if (cycleBalance) {
        balance =
          (cycleBalance / BigInt("1000000000000")).toString() + " T cycles";
      } else {
        balance = "error";
      }
    }
    return <div className=" text-white  py-1 px-2  mr-4">{balance}</div>;
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }: { open: boolean }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/">
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
                        <Link href={item.href} key={item.name}>
                          <a
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
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {CycleBalance()}
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
                <Link key={item.name} href={item.href}>
                  <a
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
                </Link>
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
