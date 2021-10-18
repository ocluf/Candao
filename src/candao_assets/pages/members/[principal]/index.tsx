import type { NextPage } from "next";
import { Nav } from "../../../components/Nav";
import PageHeading from "../../../components/PageHeading";
import MemberForm from "../../../components/MemberForm";
import { useDaoMembers } from "../../../hooks/useDaoMembers";
import { useRouter } from "next/dist/client/router";
import { Disclosure } from "@headlessui/react";
import { Member } from "../../../declarations/candao/candao.did";

const Members: NextPage = () => {
  const router = useRouter();
  const urlPrincipal = router.query.principal;
  const { daoMembers, daoMembersError, daoMembersLoading } = useDaoMembers();
  const member: Member | undefined = daoMembers?.find(
    (members) => members.principal_id.toString() == urlPrincipal
  );

  const createRemoveProposal = () => {
    if (member) {
      //TODO create remove proposal
    }
  };

  if (daoMembersLoading) {
    return (
      <div>
        <Nav current="Members"></Nav>
        <div>loading ...</div>
      </div>
    );
  } else if (daoMembersError) {
    return (
      <div>
        <Nav current="Members"></Nav>
        <div>error</div>
      </div>
    );
  } else if (!member) {
    return (
      <div>
        <Nav current="Members"></Nav>
        <div>Member does not exist</div>
      </div>
    );
  } else {
    return (
      <div className="h-screen bg-gray-100">
        <Nav current="Members"></Nav>
        <PageHeading
          crumbs={["Dashboard", "Members", "Member profile"]}
          pageTitle="Member"
          className="bg-transparent"
        >
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 mr-8 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => createRemoveProposal()}
          >
            Remove
          </button>
        </PageHeading>
        <MemberForm member={member}></MemberForm>
      </div>
    );
  }
};

export default Members;
