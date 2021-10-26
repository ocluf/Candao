import { useForm } from "react-hook-form";
import { Button } from "../Button";

type Fields = {
  name: string;
  description: string;
  principal: string;
  canVote: boolean;
};

export const AddMemberForm: React.FC<{
  onSubmit: (form: Fields) => void;
  submitting: boolean;
}> = ({ onSubmit, submitting }) => {
  const { register, handleSubmit } = useForm<Fields>();

  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            {...register("name")}
            autoComplete="name"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label
            htmlFor="principal"
            className="block text-sm font-medium text-gray-700"
          >
            Internet Identity assigned principal ID for this canister
          </label>
          <input
            type="text"
            {...register("principal")}
            autoComplete="name"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <div className="mt-1">
            <textarea
              {...register("description")}
              rows={3}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              defaultValue={""}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Brief description of the new member.
          </p>
        </div>
        <div className="relative flex items-start">
          <div className="flex items-center h-5">
            <input
              aria-describedby="can-vote-description"
              type="checkbox"
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              {...register("canVote")}
              defaultChecked
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="comments" className="font-medium text-gray-700">
              Can vote
            </label>
            <p id="can-vote-description" className="text-gray-500">
              Uncheck this box if this member isn&apos;t allowed to vote. This
              is useful for bot members.
            </p>
          </div>
        </div>
        <Button type="submit" working={submitting}>
          {submitting ? "Submitting..." : "Submit proposal"}
        </Button>
      </form>
    </div>
  );
};
