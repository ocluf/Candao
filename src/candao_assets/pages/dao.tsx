import type { NextPage } from "next";
import { Nav } from "../components/Nav";
import PageHeading from "../components/PageHeading";
import Activities from "../components/Activities";
import { useDaoInfo } from "../hooks/useDaoInfo";

const Dao: NextPage = () => {
  const { daoInfo, daoInfoError, daoInfoLoading } = useDaoInfo();
  const title = () => {
    if (daoInfoLoading) {
      return "...";
    } else if (daoInfoError) {
      return "❌";
    } else {
      return daoInfo?.title || "No title";
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      <Nav current="Dashboard"></Nav>
      <PageHeading pageTitle={title()} crumbs={["Dashboard"]}>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 mr-14 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit
        </button>
      </PageHeading>
      <Activities></Activities>
    </div>
  );
};

export default Dao;
