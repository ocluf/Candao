import { useCanisters } from "../hooks/useCanisters";
import { Canister } from "../declarations/candao/candao.did";
import { useCanisterStatus } from "../hooks/useCanisterStatus";
import { getCanisterStatusName } from "../utils/proposals";
import { PlayIcon, StopIcon } from "@heroicons/react/solid";
import { UploadIcon } from "@heroicons/react/outline";
import { useActor } from "./ActorProvider";
import WarningModal from "./WarningModal";
import React, { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { useDaoMembers } from "../hooks/useDaoMembers";

const CanisterCard: React.FC<{ canister: Canister }> = ({ canister }) => {
  const { statusLoading, statusError, canisterStatus, refetchCanisterStatus } =
    useCanisterStatus(canister.canister_id);
  const { daoMembers } = useDaoMembers();

  const { actor } = useActor();
  const [isModalOpen, setModalOpen] = useState(false);
  const [working, setWorking] = useState(false);

  const stopCanister = async () => {
    setWorking(true);
    await actor.create_proposal({
      StopCanister: {
        canister_id: canister.canister_id,
      },
    });
    if (daoMembers?.length === 1) {
      await refetchCanisterStatus();
    }
    setWorking(false);
  };

  const startCanister = async () => {
    setWorking(true);
    await actor.create_proposal({
      StartCanister: {
        canister_id: canister.canister_id,
      },
    });
    if (daoMembers?.length === 1) {
      await refetchCanisterStatus();
    }
    setWorking(false);
  };

  const warningMessage = (
    <p>
      This will create a stop proposal for canister <b>{canister.name}</b> are
      you sure you want to continue?
    </p>
  );

  const statusButton = () => {
    if (statusLoading) {
      return (
        <div className="flex items-center">
          <FiLoader className="animate-spin  mr-3"></FiLoader> Loading...
        </div>
      );
    } else if (statusError) {
      return "error";
    } else {
      const status = canisterStatus?.[0]?.status;
      if (status && getCanisterStatusName(status) == "Running") {
        return (
          <>
            <button
              className="flex flex-row items-center	 text-red-500 cursor-pointer"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              {working && <FiLoader className="animate-spin  mr-3"></FiLoader>}
              {!working && <StopIcon className="w-5 mr-2 "></StopIcon>}
              <div>Stop</div>
            </button>
            <WarningModal
              title="Stop Canister"
              confirmButtonText="Create Stop Proposal"
              confirmButtonLoadingText="Creating Stop Proposal..."
              message={warningMessage}
              onConfirm={stopCanister}
              open={isModalOpen}
              setOpen={setModalOpen}
            ></WarningModal>
          </>
        );
      } else if (status && getCanisterStatusName(status) == "Stopped") {
        return (
          <button
            className="flex items-center flex-row text-green-500"
            onClick={() => startCanister()}
          >
            {working && <FiLoader className="animate-spin  mr-3"></FiLoader>}
            {!working && <PlayIcon className="w-5 mr-2 "></PlayIcon>}
            <div>Start</div>
          </button>
        );
      } else {
        return "Stopping...";
      }
    }
  };

  return (
    <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
      <div className="w-full flex flex-col items-center justify-between p-6 mb-auto">
        <div className="flex justify center">
          <h3 className="text-gray-900 text-sm mx-auto font-medium truncate">
            {canister.name}
          </h3>
        </div>
        <p className="mt-1 flex-grow text-gray-500 w-full h-16 pb-4 break-word text-center text-sm overflow-hidden">
          {canister.description}
        </p>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="w-0 flex-1 flex">
            <a className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500">
              <span>{statusButton()}</span>
            </a>
          </div>
          <div className="-ml-px w-0 flex-1 flex">
            <a className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500">
              <span className="flex flex-row">
                <UploadIcon className="w-5 mr-2"></UploadIcon> Update
              </span>
            </a>
          </div>
        </div>
      </div>
    </li>
  );
};

const Canisters = () => {
  const { canistersLoading, canistersError, canisters } = useCanisters();

  if (canistersLoading) {
    return <div>Loading ...</div>;
  } else if (canistersError) {
    return <div>Error...</div>;
  } else {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ul
          role="list"
          className=" grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {canisters?.map((canister) => (
            <CanisterCard
              key={canister.canister_id.toString()}
              canister={canister}
            ></CanisterCard>
          ))}
        </ul>
      </main>
    );
  }
};

export default Canisters;
