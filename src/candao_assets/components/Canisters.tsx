import { useCanisters } from "../hooks/useCanisters"
import { Canister } from "../declarations/candao/candao.did"
import { useCanisterStatus } from "../hooks/userCanisterStatus"
import { getCanisterStatusName } from "../utils/proposals";
import { PlayIcon, StopIcon } from "@heroicons/react/solid";
import { UploadIcon } from "@heroicons/react/outline";

const CanisterCard: React.FC<{canister: Canister}> = ({canister}) => {
    const {statusLoading, statusError, canisterStatus} = useCanisterStatus(canister.canister_id);
    const statusButton = () =>  {
        if(statusLoading){
            return "..."
        } else if ( statusError){
            return "error"
        } else {
            const status = canisterStatus?.[0]?.status;
            if(status && getCanisterStatusName(status) == "Running"){
                return <div className="flex flex-row text-red-500"><StopIcon className="w-5 mr-2 "></StopIcon> <div>Stop</div> </div>;
            } else if (status && getCanisterStatusName(status) == "Stopped"){
                return <div className="flex flex-row text-green-500"><PlayIcon className="w-5 mr-2 "></PlayIcon> <div>Start</div> </div>;
            } else  {
                return "Stopping..."
            }
        }
    }


    return (<li key={canister.canister_id.toString()} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
    <div className="w-full flex flex-col items-center justify-between p-6 mb-auto">
        <div className="flex justify center">
          <h3 className="text-gray-900 text-sm mx-auto font-medium truncate">{canister.name}</h3>
        </div>
        <p className="mt-1 flex-grow text-gray-500 w-full h-16 pb-4 break-word text-center text-sm overflow-hidden">{canister.description}</p>
    </div>
    <div>
      <div className="-mt-px flex divide-x divide-gray-200">
        <div className="w-0 flex-1 flex">
          <a
            className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
          >
            
            <span >{statusButton()}</span>
          </a>
        </div>
        <div className="-ml-px w-0 flex-1 flex">
          <a
            className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
          > 
          
            <span className="flex flex-row"><UploadIcon className="w-5 mr-2"></UploadIcon> Update</span>
          </a>
        </div>
      </div>
    </div>
  </li>)
}

const Canisters = () => {
    const {canistersLoading,canistersError, canisters } = useCanisters();

    if(canistersLoading){
        return <div>Loading ...</div>
    } else if (canistersError) {
        return <div>Error...</div>
    } else {
        return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ul role="list" className=" grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {canisters?.map((canister) => (
                 <CanisterCard canister={canister}></CanisterCard>
              ))}
            </ul>
            </main>
          )
    }
}

export default Canisters;