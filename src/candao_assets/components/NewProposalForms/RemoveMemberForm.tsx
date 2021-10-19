import classNames from "classnames";
import { useForm } from "react-hook-form";
import { useDaoMembers } from "../../hooks/useDaoMembers";
import { shortenPrincipalId } from "../../utils/members";

type Fields = {
  principal: string;
};

export const RemoveMemberForm: React.FC<{
  onSubmit: (form: Fields) => void;
  submitting: boolean;
}> = ({ onSubmit, submitting }) => {
  const { register, handleSubmit } = useForm<Fields>();
  const { daoMembers, daoMembersLoading } = useDaoMembers();

  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="">
          <label
            className="text-lg font-medium leading-6 text-gray-900"
            htmlFor="proposal-type"
          >
            Select proposal type
          </label>
          <select
            className={classNames(
              "mt-4 block w-full mr-8 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              { "text-gray-500": daoMembersLoading || submitting }
            )}
            disabled={submitting}
            {...register("principal")}
          >
            <option disabled value="" selected>
              {daoMembersLoading ? "Loading members..." : "Select a member..."}
            </option>
            {daoMembers &&
              daoMembers.map((m) => {
                const id = m.principal_id.toString();
                return (
                  <option key={id} value={id}>
                    {m.name
                      ? `${m.name} (${shortenPrincipalId(id)})`
                      : shortenPrincipalId(id)}
                  </option>
                );
              })}
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:hover:bg-gray-400"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit proposal"}
        </button>
      </form>
    </div>
  );
};
