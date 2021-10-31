import type { NextPage } from "next";
import { Nav } from "../../../components/Nav";
import PageHeading from "../../../components/PageHeading";
import MemberForm from "../../../components/MemberForm";
import { useDaoMembers } from "../../../hooks/useDaoMembers";
import { useRouter } from "next/dist/client/router";
import WarningModal from "../../../components/WarningModal";
import { Member } from "../../../declarations/candao/candao.did";
import { useState } from "react";
import { useActor } from "../../../components/ActorProvider";

const Members: NextPage = () => {
  const router = useRouter();
  const { actor } = useActor();
  const urlPrincipal = router.query.principal;
  const { daoMembers, daoMembersError, daoMembersLoading } = useDaoMembers();
  const [open, setOpen] = useState(false);

  const member: Member | undefined = daoMembers?.find(
    (members) => members.principal_id.toString() == urlPrincipal
  );

  const removeMember = async () => {
    if (member) {
      await actor.create_proposal({
        RemoveMember: member.principal_id,
      });
    }
  };

  const warningMessage = (
    <p>
      This will create a remove member proposal for <b>{member?.name}</b> Are
      you sure you want to continue?
    </p>
  );

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
      <>
        <WarningModal
          open={open}
          setOpen={setOpen}
          title="Remove Member"
          confirmButtonText="Create Remove Proposal"
          confirmButtonLoadingText="Creating Remove Proposal..."
          message={warningMessage}
          onConfirm={removeMember}
        ></WarningModal>

        <div className="h-screen bg-gray-100">
          <Nav current="Members"></Nav>
          <PageHeading
            crumbs={[
              { title: "Dashboard", href: "dashboard}" },
              { title: "Members", href: "/members" },
              { title: "Member profile", href: "#" },
            ]}
            pageTitle="Member"
            className="bg-white"
          >
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                setOpen(true);
              }}
            >
              Remove
            </button>
          </PageHeading>
          <MemberForm member={member}></MemberForm>
        </div>
      </>
    );
  }
};

export default Members;
