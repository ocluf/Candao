import classNames from "classnames";
import { useForm } from "react-hook-form";
import { useCanisters } from "../../hooks/useCanisters";

type Fields = {
  canister_id: string;
  cycles: string;
};

export const DepositCyclesForm: React.FC<{
  onSubmit: (form: Fields) => void;
  submitting: boolean;
}> = ({ onSubmit, submitting }) => {
  const { register, handleSubmit, watch } = useForm<Fields>();
  const { canisters, canistersLoading } = useCanisters();
  const watchedCanisterId = watch("canister_id");

  return (
    <div>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="canister_id"
            className="block text-sm font-medium text-gray-700"
          >
            Canister
          </label>

          <select
            className={classNames(
              "mt-4 block w-full mr-8 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              { "text-gray-500": canistersLoading || submitting }
            )}
            disabled={submitting}
            defaultValue=""
            {...register("canister_id")}
            required
          >
            <option disabled value="">
              {canistersLoading
                ? "Loading canisters..."
                : "Select a canister..."}
            </option>
            {canisters &&
              canisters.map((m) => {
                const id = m.canister_id.toString();
                return (
                  <option key={id} value={id}>
                    {id}
                  </option>
                );
              })}
          </select>
        </div>

        <div>
          <label
            htmlFor="cycles"
            className="block text-sm font-medium text-gray-700"
          >
            Cycles
          </label>
          <input
            type="text"
            placeholder="Nr of cycles to transfer from the DAO canister (min 1T)"
            {...register("cycles")}
            defaultValue={1000000000000}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:hover:bg-gray-400"
          disabled={submitting || !watchedCanisterId}
        >
          {submitting ? "Submitting..." : "Submit proposal"}
        </button>
      </form>
    </div>
  );
};
