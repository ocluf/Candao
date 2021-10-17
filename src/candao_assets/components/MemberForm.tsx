import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { Member } from "../declarations/candao/candao.did";

const MemberForm: React.FC<{ member: Member }> = ({ member }) => {
  const [username, setUsername] = useState(member.name);

  return (
    <form className="mx-8 m-5 px-8 py-12 bg-white space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Profile
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Use a permanent address where you can receive mail.
          </p>
        </div>
      </div>
      <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            Username
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
        <label
          htmlFor="principal id"
          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
        >
          Principal ID
        </label>
        <div className="mt-1 sm:mt-0 sm:col-span-2">
          <div>
            <label htmlFor="principal ID" className="sr-only">
              principal ID
            </label>
            <input
              type="text"
              name="principal ID"
              id="principal ID"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block text-grey-400 w-full sm:text-sm border-gray-300 rounded-md"
              defaultValue={member.principal_id.toString()}
              disabled
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default MemberForm;
