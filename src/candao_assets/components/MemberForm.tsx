import { useState } from "react";
import { useForm } from "react-hook-form";
import { Member } from "../declarations/candao/candao.did";
import { useActor } from "./ActorProvider";

type Fields = {
  name: string;
  description: string;
  principal: string;
};

const MemberForm: React.FC<{ member: Member }> = ({ member }) => {
  const { register, handleSubmit } = useForm<Fields>();
  const [submitting, setSubmitting] = useState(false);
  const { actor } = useActor();

  const onSubmit = async (form: Fields) => {
    setSubmitting(true);
    const response = await actor.update_member_info(
      form.name,
      form.description
    );
    console.log(response);
    setSubmitting(false);
  };

  return (
    <>
      <form
        className="mx-8 m-5 px-8 py-12 bg-white space-y-8 divide-y divide-gray-200"
        onSubmit={handleSubmit(onSubmit)}
      >
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
                  id="username"
                  {...register("name")}
                  defaultValue={member.name}
                  required
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
          <label
            htmlFor="about"
            className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          >
            About
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <textarea
              id="about"
              {...register("description")}
              rows={3}
              className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
              defaultValue={member.description}
            />
            <p className="mt-2 text-sm text-gray-500">
              Write a few sentences about yourself.
            </p>
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
                className="shadow-sm text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 block w-full md:w-principal sm:text-sm border-gray-300 rounded-md"
                defaultValue={member.principal_id.toString()}
                disabled
              />
            </div>
          </div>
        </div>

        <div className="w-full flex">
          <button
            type="submit"
            className="inline-flex items-center ml-auto mt-5 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </>
  );
};

export default MemberForm;
