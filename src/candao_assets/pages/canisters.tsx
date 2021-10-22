import type { NextPage } from "next";
import { Nav } from "../components/Nav";
import PageHeading from "../components/PageHeading";
// import { useCanisterData } from "../hooks/useCanisterData";

const Canisters: NextPage = () => {
  // useCanisterData();
  return (
    <div className="h-screen bg-gray-100">
      <Nav current="Canisters" />
      <PageHeading crumbs={["Dashboard", "Canisters"]} pageTitle="Canisters">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 mr-8 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Link Canister
        </button>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 mr-8 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Canister
        </button>
      </PageHeading>
    </div>
  );
};

export default Canisters;
