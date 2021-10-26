import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useActor } from "../components/ActorProvider";
import { Alert } from "../components/Alert";
import { LoginState, useAuth } from "../components/AuthProvider";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import PageHeading from "../components/PageHeading";
import { PublicNav } from "../components/PublicNav";
import { useInvitationStatus } from "../hooks/useInvitationStatus";
import { enumIs } from "../utils/enums";
import Link from "next/link";
import { InvitationStatus } from "../declarations/candao/candao.did";
import { unreachable } from "../utils/unreachable";

type FormFields = {
  name: string;
  message: string;
};

function invitationStatusName(inv: InvitationStatus) {
  if (enumIs(inv.status, "Executed")) return "Accepted";
  if (enumIs(inv.status, "InProgress")) return "Being voted on";
  if (enumIs(inv.status, "Failed")) return "Rejected";
  if (enumIs(inv.status, "Rejected")) return "Rejected";
  unreachable(inv.status);
}

const Invite: NextPage = () => {
  const { authState, authClient, logout } = useAuth();
  const { actor } = useActor();
  const router = useRouter();

  useEffect(() => {
    if (authState === LoginState.LoggedOut) {
      router.push("/");
    }
  }, [authState]);

  const { register, handleSubmit } = useForm<FormFields>();
  const [working, setWorking] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const { invitationStatus, refetchInvitationStatus, invitationStatusLoading } =
    useInvitationStatus();

  const onSubmit = async (form: FormFields) => {
    setWorking(true);

    const res = await actor.create_proposal({
      JoinRequest: {
        name: form.name,
        message: form.message,
      },
    });

    if (enumIs(res, "Success")) {
      setJustSubmitted(true);
      await refetchInvitationStatus();
    }

    setWorking(false);
  };

  return (
    <div className="h-screen bg-gray-100">
      <PublicNav></PublicNav>
      <PageHeading pageTitle="Request an invite" crumbs={[]}>
        {authState === LoginState.LoggedIn && (
          <Button onClick={logout} variant="outline">
            Log out
          </Button>
        )}
      </PageHeading>
      <main className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!invitationStatusLoading && invitationStatus?.[0] && justSubmitted && (
          <Card>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-8">
              Invitation Request Sent!
            </h3>

            <Alert title="Success" variant="success">
              You invitation request has been sent to the members of the DAO.
              Please check back later to to see if they accepted or rejected
              your request.
            </Alert>
          </Card>
        )}
        {!invitationStatusLoading && invitationStatus?.[0] && !justSubmitted && (
          <Card>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-5">
              Invitation Request Status
            </h3>
            {enumIs(invitationStatus[0].status, "Executed") && (
              <Alert title="Invitation request accepted" variant="success">
                <p>Your request has been accepted, you are now a member.</p>
                <Link href="/dao">
                  <a>
                    <Button variant="outline" color="green" className="mt-6">
                      Proceed to the dashboard
                    </Button>
                  </a>
                </Link>
              </Alert>
            )}

            {!enumIs(invitationStatus[0].status, "Executed") && (
              <div className="pt-5 max-w-3xl">
                <dl className="space-y-8">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {invitationStatusName(invitationStatus[0])}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {invitationStatus[0].name}
                    </dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Message
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {invitationStatus[0].message}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </Card>
        )}
        {!invitationStatusLoading && invitationStatus && !invitationStatus[0] && (
          <Card>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-8">
              Your information
            </h3>
            <form
              className="space-y-6 max-w-3xl"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Principal ID
                  </label>
                  <div className="text-gray-500 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2 border">
                    {authClient?.getIdentity().getPrincipal().toString()}
                  </div>
                </div>
              </div>
              <div>
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
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message to the DAO members
                </label>
                <div className="mt-1">
                  <textarea
                    {...register("message")}
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Tell the members who you are and why you&apos;re requesting to
                  join this DAO.
                </p>
              </div>
              <div className="text-right mt-6">
                <Button type="submit" working={working}>
                  {working ? "Sending request..." : "Request invitiation"}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Invite;
