import type { NextPage } from "next";
import { Nav } from "../components/Nav";
import PageHeading from "../components/PageHeading"
import Activities from "../components/Activities"
import { useDaoInfo } from "../hooks/useDaoInfo";

const Dao: NextPage = () => {
  const { daoInfo, daoInfoError, daoInfoLoading } = useDaoInfo()
  const title = () => {
    if (daoInfoLoading) {
      return "..."
    } else if (daoInfoError) {
      return "❌"
    } else {
      return daoInfo?.title || "No title"
    }
  }

  return (
    <div className="h-screen bg-gray-100">
      <Nav current="Dashboard"></Nav>
      <PageHeading pageTitle={title()} crumbs={["Dashboard"]} ></PageHeading>
      <Activities></Activities>
    </div>
  );
};

export default Dao;
