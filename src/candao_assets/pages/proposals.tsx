import type { NextPage } from "next";
import { Nav } from "../components/Nav";
import PageHeading from "../components/PageHeading";
import { useCanisters } from "../hooks/useCanisters";
import { useDaoMembers } from "../hooks/useDaoMembers";
import { useProposals } from "../hooks/useProposals";
import { resolveMemberPrincipalId } from "../utils/members";
import { getProposalSummary, getProposalTypeName } from "../utils/proposals";

const Proposals: NextPage = () => {
  const { proposals, proposalsLoading } = useProposals();
  const { daoMembers, daoMembersLoading } = useDaoMembers();
  const { canisters, canistersLoading } = useCanisters();

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav current="Proposals"></Nav>
      <PageHeading
        crumbs={["Dashboard", "Proposals"]}
        pageTitle="Proposals"
      ></PageHeading>

      <main className="p-8">
        {proposals &&
          !proposalsLoading &&
          daoMembers &&
          !daoMembersLoading &&
          canisters &&
          !canistersLoading && (
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Proposal
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Proposer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Your vote
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {proposals.map((proposal, personIdx) => (
                    <tr
                      key={proposal.proposal_id.toString()}
                      className={
                        personIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getProposalTypeName(proposal.proposal_type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getProposalSummary(proposal, daoMembers, canisters)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {resolveMemberPrincipalId(
                          daoMembers,
                          proposal.proposer
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </main>
    </div>
  );
};

export default Proposals;
