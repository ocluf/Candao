import { useDaoMembers } from "../hooks/useDaoMembers";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";

const MembersTable = () => {
  const { daoMembers, daoMembersError, daoMembersLoading } = useDaoMembers();

  if (daoMembersError) {
    return <div>something went wrong</div>;
  } else if (daoMembersLoading) {
    return <div>...</div>;
  } else {
    return (
      <div className="flex flex-col py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      USERNAME
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      PRINCIPLE ID
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {daoMembers?.map((member, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.principal_id.toString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={"/members/" + member.principal_id.toString()}
                        >
                          <a className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </a>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default MembersTable;
