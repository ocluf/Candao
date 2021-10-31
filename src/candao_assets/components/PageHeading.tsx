/* This example requires Tailwind CSS v2.0+ */
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import Link from "next/link";
import React from "react";

type Crumb = {
  title: string;
  href: string;
};

const BreadCrumbs: React.FC<{ crumbs: Array<Crumb> }> = ({ crumbs }) => {
  return (
    <div>
      <nav className="sm:hidden" aria-label="Back">
        <a
          href="#"
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ChevronLeftIcon
            className="flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Back
        </a>
      </nav>
      <nav className="hidden sm:flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-4">
          {crumbs.map((crumb, index) => {
            let classes =
              "text-sm font-medium text-gray-500 hover:text-gray-700";
            if (index > 0) {
              classes += " ml-4";
            }
            return (
              <li key={index}>
                <div className="flex">
                  {index > 0 ? (
                    <ChevronRightIcon
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  ) : null}
                  <Link href={crumb.href}>
                    <a className={classes}>{crumb.title}</a>
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

const PageHeading: React.FC<{
  pageTitle: String;
  crumbs: Array<Crumb>;
  className?: String;
}> = ({ children, pageTitle, crumbs, className }) => {
  return (
    <div className={"pt-6 pb-5 bg-white  drop-shadow-sm " + className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden sm:block">
          <BreadCrumbs crumbs={crumbs} />
        </div>
        <div className="sm:mt-2 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {pageTitle}
            </h2>
          </div>
          <div className="sm:mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeading;
