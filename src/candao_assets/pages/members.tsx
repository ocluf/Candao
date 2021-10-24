import type { NextPage } from "next";
import { Nav } from "../components/Nav";
import PageHeading from "../components/PageHeading";
import MembersTable from "../components/MemberTable";

import Link from "next/link";

const Members: NextPage = () => {
  return (
    <div className="h-screen bg-gray-100">
      <Nav current="Members"></Nav>
      <PageHeading crumbs={["Dashboard", "Members"]} pageTitle="Members">
        <Link href="/proposals/new">
          <a
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add new member
          </a>
        </Link>
      </PageHeading>
      <MembersTable></MembersTable>
    </div>
  );
};

export default Members;
