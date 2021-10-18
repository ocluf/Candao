import { Actor } from "@dfinity/agent";
import {
  UsersIcon,
  ServerIcon,
  CursorClickIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/dist/client/router";
import { useDaoMembers } from "../hooks/useDaoMembers";
import Link from "next/link";

type ActivityCard = {
  name: string;
  subtitle: string;
  route: string;
  icon: any;
};

export default function Activities() {
  const route = useRouter();
  const { daoMembers, daoMembersError, daoMembersLoading } = useDaoMembers();
  const nrOfMembers = () => {
    if (daoMembersLoading) {
      return "...";
    } else if (daoMembersError) {
      return "❌";
    } else {
      return daoMembers?.length.toString() || "No members";
    }
  };
  const nrOfProposals = () => {
    //TODO write gproposals hook
  };

  const nrOfCanisters = () => {
    //TODO write gcanisters hook
  };
  const Activities: Array<ActivityCard> = [
    {
      name: "Total members",
      subtitle: nrOfMembers(),
      route: "/members",
      icon: (
        <UsersIcon className="relative top-3 left-3 bg-purple-600 h-5 w-5 text-white" />
      ),
    },
    {
      name: "Total canisters",
      subtitle: "3",
      route: "/canisters",
      icon: (
        <ServerIcon className="relative top-3 left-3 bg-purple-600 h-5 w-5 text-white" />
      ),
    },
    {
      name: "Proposals",
      subtitle: "20 new",
      route: "/proposals",
      icon: (
        <CursorClickIcon className="relative top-3 left-3 bg-purple-600 h-5 w-5 text-white" />
      ),
    },
  ];
  return (
    <main className="px-5">
      <h1 className="py-5 text-lg text-grey-900 font-medium leading-6">
        Activities
      </h1>
      <ul
        role="list"
        className="  grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 "
      >
        {Activities.map((activity) => (
          <li
            key={activity.name}
            className="col-span-1 bg-white rounded-md shadow"
          >
            <Link href={activity.route}>
              <a className="cursor-pointer">
                <div className="flex p-6">
                  <div className="bg-purple-600 h-11 w-12 mx-auto my-auto rounded-lg">
                    {activity.icon}
                  </div>
                  <div className="w-full pl-4 flex items-center justify-between space-x-6">
                    <div className="flex-1 truncate">
                      <div className="flex items-center">
                        <h3 className=" text-gray-500 text-sm truncate">
                          {activity.name}
                        </h3>
                      </div>
                      <p className=" text-gray-900 text-2xl font-medium truncate">
                        {activity.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 text-sm font-medium leading-5 text-purple-600 ">
                  View all
                </div>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
