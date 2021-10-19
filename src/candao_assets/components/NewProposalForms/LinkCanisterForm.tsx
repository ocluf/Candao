import classNames from "classnames";
import { useForm } from "react-hook-form";
import { FiInfo } from "react-icons/fi";
import { useDaoMembers } from "../../hooks/useDaoMembers";
import { shortenPrincipalId } from "../../utils/members";

type Fields = {
  canister_id: string;
};

export const LinkCanisterForm: React.FC<{
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
            htmlFor="principal"
            className="block text-sm font-medium text-gray-700"
          >
            Canister ID
          </label>
          <input
            type="text"
            {...register("canister_id")}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="bg-blue-100 p-3 flex items-center">
          <FiInfo className="text-blue-600 mr-2 text-xl"></FiInfo>

          <span className="text-gray-700">
            Tip: don&apos;t forget to make this DAO (
            {process.env.CANDAO_CANISTER_ID}) as the only controller.
          </span>
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
