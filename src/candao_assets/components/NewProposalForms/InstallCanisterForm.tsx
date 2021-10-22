import classNames from "classnames";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useCanisters } from "../../hooks/useCanisters";
import { unreachable } from "../../utils/unreachable";

type Fields = {
  canister_id: string;
  mode: "install" | "upgrade" | "reinstall";
  wasm_module: FileList;
};

export const installModeToCandidInstallMode = (mode: Fields["mode"]) => {
  switch (mode) {
    case "install":
      return { install: null };
    case "upgrade":
      return { upgrade: null };
    case "reinstall":
      return { reinstall: null };
    default:
      unreachable(mode);
  }
};

export const InstallCanisterForm: React.FC<{
  onSubmit: (form: Fields) => void;
  submitting: boolean;
}> = ({ onSubmit, submitting }) => {
  const { register, handleSubmit, watch } = useForm<Fields>();
  const { canisters, canistersLoading } = useCanisters();
  const watchedCanisterId = watch("canister_id");
  const watchedFile = watch("wasm_module");
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = register("wasm_module");

  console.log(watchedFile);

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
            htmlFor="mode"
            className="block text-sm font-medium text-gray-700"
          >
            Mode
          </label>
          <select
            className={classNames(
              "mt-4 block w-full mr-8 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              { "text-gray-500": canistersLoading || submitting }
            )}
            disabled={submitting}
            {...register("mode")}
          >
            <option value="install">Install (requires empty canister)</option>
            <option value="upgrade">Upgrade</option>
            <option value="reinstall">
              Renstall (clears canister contents)
            </option>
          </select>
        </div>
        <div className="sm:col-span-6">
          <label
            htmlFor="wasm"
            className="block text-sm font-medium text-gray-700"
          >
            Wasm binary
          </label>
          <div className="mt-1 flex pt-5 pb-6">
            <div className="space-y-1 text-center">
              <button
                type="button"
                className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => uploadRef.current?.click()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  width="48"
                  height="48"
                  viewBox="0 0 612 612"
                  className="-ml-1 mr-3 h-5 w-5 inline-block"
                >
                  <path
                    d="m376 0c0 1.08 0 2.16 0 3.3 0 38.76-31.42 70.17-70.17 70.17-38.76 0-70.17-31.42-70.17-70.17l0 0c0-1.14 0-2.22 0-3.3L0 0l0 612 612 0 0-612z"
                    fill="#654ff0"
                  />
                  <path
                    d="m142.16 329.81 40.56 0 27.69 147.47 0.5 0 33.28-147.47 37.94 0 30.06 149.28 0.59 0 31.56-149.28 39.78 0-51.69 216.69-40.25 0-29.81-147.47-0.78 0-31.91 147.47-41 0zm287.69 0 63.94 0 63.5 216.69-41.84 0-13.81-48.22-72.84 0-10.66 48.22-40.75 0zm24.34 53.41-17.69 79.5 55.06 0-20.31-79.5z"
                    fill="#fff"
                  />
                </svg>
                Choose Wasm binary
              </button>

              {watchedFile && watchedFile.length > 0 && (
                <span className="inline-block ml-6 ">
                  Selected: <strong>{watchedFile[0].name}</strong>
                </span>
              )}

              <input
                type="file"
                className="sr-only"
                ref={(e) => {
                  ref(e);
                  uploadRef.current = e;
                }}
                {...rest}
              />
            </div>
          </div>
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
