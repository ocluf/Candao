import type { NextPage } from "next";
import Link from "next/link";

import Canisters from "../components/Canisters";
import { Nav } from "../components/Nav";
import PageHeading from "../components/PageHeading";

const CanisterPage: NextPage = () => {
  return (
    <div className="h-screen bg-gray-100">
      <Nav current="Canisters" />
      <PageHeading crumbs={["Dashboard", "Canisters"]} pageTitle="Canisters">
        <Link href="/proposals/new">
          <a
            type="button"
            className="inline-flex items-center px-4 py-2 mr-5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Link Canister
          </a>
        </Link>
        <Link href="/proposals/new">
          <a
            type="button"
            className="inline-flex items-center px-4 py-2  border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Canister
          </a>
        </Link>
      </PageHeading>
      <Canisters></Canisters>
    </div>
  );
};

export default CanisterPage;
