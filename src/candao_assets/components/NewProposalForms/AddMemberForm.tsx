import { useForm } from "react-hook-form";

type Fields = {
  name: string;
  description: string;
  principal: string;
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
