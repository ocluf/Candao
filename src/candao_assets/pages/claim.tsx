import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useActor } from "../components/ActorProvider";
import { LoginState, useAuth } from "../components/AuthProvider";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ClaimStep, ClaimSteps } from "../components/Claim/ClaimSteps";
import { DaoForm, DaoFormFields } from "../components/Claim/DaoForm";
import {
  ProfileForm,
  ProfileFormFields,
} from "../components/Claim/ProfileForm";
import { Nav } from "../components/Nav";
import PageHeading from "../components/PageHeading";
import { useDaoInfo } from "../hooks/useDaoInfo";
import { useDaoMembers } from "../hooks/useDaoMembers";

const Claim: NextPage = () => {
  const { daoInfo, daoInfoError, daoInfoLoading, refetchDaoInfo } =
    useDaoInfo();
  const { authState, login, authClient, logout } = useAuth();
  const {
    daoMembers,
    daoMembersError,
    daoMembersLoading,
    me,
    refetchDaoMembers,
  } = useDaoMembers();
  const { actor } = useActor();
  const router = useRouter();

  useEffect(() => {
    if (authState === LoginState.LoggedOut) {
      router.push("/");
    }
  }, [authState]);

  const [step, setStep] = useState<ClaimStep>(ClaimStep.Profile);
  const [working, setWorking] = useState(false);

  const onProfileSubmit = async (form: ProfileFormFields) => {
    setWorking(true);
    await actor.update_member_info(form.name, form.description);
    await refetchDaoMembers();
    setWorking(false);
    setStep(ClaimStep.Dao);
  };
  const onDaoSubmit = async (form: DaoFormFields) => {
    setWorking(true);
    await actor.update_dao_info({
      title: form.name,
      description: form.description,
    });
    await refetchDaoInfo();
    setWorking(false);
    setStep(ClaimStep.Done);
  };

  console.log(me);

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav showMenu={false}></Nav>
      <PageHeading pageTitle="Welcome!" crumbs={[]}></PageHeading>
      <main className="max-w-7xl mx-auto pt-12 px-4 sm:px-6 lg:px-8 flex space-x-8">
        <ClaimSteps onClick={setStep} currentStep={step}></ClaimSteps>

        {step === ClaimStep.Profile && (
          <ProfileForm
            onSubmit={onProfileSubmit}
            working={working}
            initialName={me ? me.name : ""}
            initialDescription={me ? me.description : ""}
          ></ProfileForm>
        )}
        {step === ClaimStep.Dao && (
          <DaoForm
            onSubmit={onDaoSubmit}
            working={working}
            initialName={daoInfo ? daoInfo.title : ""}
            initialDescription={daoInfo ? daoInfo.description : ""}
          ></DaoForm>
        )}
        {step === ClaimStep.Done && (
          <Card className="flex-1">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-8">
              Setup complete!
            </h3>
            <p className="mt-6 text-base leading-5 font-normal text-gray-600">
              You can now start using your DAO.
            </p>
            <Link href="/dao" passHref>
              <Button as="a" className="mt-12">
                Go to the Dashboard
              </Button>
            </Link>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Claim;
