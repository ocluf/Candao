import type { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useActor } from "../../components/ActorProvider";
import { Nav } from "../../components/Nav";
import PageHeading from "../../components/PageHeading";
import { DaoInfo } from "../../declarations/candao/candao.did";
import { useDaoInfo } from "../../hooks/useDaoInfo";

type Fields = {
  title: string;
  description: string;
};

const DaoInfoForm: React.FC<{ daoInfo: DaoInfo }> = ({ daoInfo }) => {
  const { register, handleSubmit } = useForm<Fields>();
  const [submitting, setSubmitting] = useState(false);
  const { actor } = useActor();

  const onSubmit = async (form: Fields) => {
    setSubmitting(true);
    const response = await actor.update_dao_info({
      title: form.title,
      description: form.description,
    });
    console.log(response);
    setSubmitting(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form
        className="px-8 py-12 max-w-7xl bg-white shadow sm:rounded space-y-8 divide-y divide-gray-200"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Use this form to update the title and desciption of the DAO
            </p>
          </div>
        </div>

        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Title
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <div>
                <label htmlFor="title" className="sr-only">
                  title
                </label>
                <input
                  type="text"
                  id="username"
                  {...register("title")}
                  defaultValue={daoInfo.title}
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
              defaultValue={daoInfo.description}
            />
            <p className="mt-2 text-sm text-gray-500">
              Write a few sentences describing the DAO.
            </p>
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
    </main>
  );
};

const DaoInfoPage: NextPage = () => {
  const { daoInfo, daoInfoError, daoInfoLoading } = useDaoInfo();
  const title = () => {
    if (daoInfoLoading) {
      return "...";
    } else if (daoInfoError) {
      return "❌";
    } else {
      return daoInfo?.title || "No title";
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      <Nav current="Dashboard"></Nav>
      <PageHeading
        pageTitle={title()}
        crumbs={[
          { title: "Dashboard", href: "#" },
          { title: "dao information", href: "#" },
        ]}
      ></PageHeading>
      {daoInfo && <DaoInfoForm daoInfo={daoInfo} />}
    </div>
  );
};

export default DaoInfoPage;
