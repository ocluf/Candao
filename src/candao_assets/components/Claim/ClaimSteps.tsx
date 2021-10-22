import classNames from "classnames";
import { FiCheck } from "react-icons/fi";
import PageHeading from "../PageHeading";

export enum ClaimStep {
  Welcome = 0,
  Profile,
  Dao,
  Done,
}

const steps = [
  {
    name: "DAO claimed by you",
    description: "You are the only member for now",
  },
  {
    name: "Profile information",
    description: "Please add some info about yourself",
  },
  {
    name: "DAO INFORMATION",
    description: "Add a short description about your DAO",
  },
  {
    name: "DONE",
    description: "Get started with using CanDAO",
  },
];

export const ClaimSteps: React.FC<{
  onClick: (step: ClaimStep) => void;
  currentStep: ClaimStep;
}> = ({ onClick, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden">
        {steps.map((step, stepIdx) => {
          let status: "complete" | "current" | "upcoming" = "complete";
          if (stepIdx > currentStep) {
            status = "upcoming";
          } else if (stepIdx === currentStep) {
            status = "current";
          }

          return (
            <li
              key={step.name}
              className={classNames(
                stepIdx !== steps.length - 1 && "pb-10",
                "relative"
              )}
            >
              {status === "complete" ? (
                <>
                  {stepIdx !== steps.length - 1 ? (
                    <div
                      className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-indigo-600"
                      aria-hidden="true"
                    />
                  ) : null}
                  <button
                    className="relative flex items-start group text-left"
                    disabled={stepIdx === 0}
                    onClick={() => onClick(stepIdx)}
                  >
                    <span className="h-9 flex items-center">
                      <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-full group-hover:bg-indigo-800">
                        <FiCheck
                          className="w-5 h-5 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                    <span className="ml-4 min-w-0 flex flex-col">
                      <span className="text-xs font-semibold tracking-wide uppercase">
                        {step.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {step.description}
                      </span>
                    </span>
                  </button>
                </>
              ) : status === "current" ? (
                <>
                  {stepIdx !== steps.length - 1 ? (
                    <div
                      className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
                      aria-hidden="true"
                    />
                  ) : null}
                  <button
                    className="relative flex items-start group text-left"
                    aria-current="step"
                  >
                    <span className="h-9 flex items-center" aria-hidden="true">
                      <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-indigo-600 rounded-full">
                        <span className="h-2.5 w-2.5 bg-indigo-600 rounded-full" />
                      </span>
                    </span>
                    <span className="ml-4 min-w-0 flex flex-col">
                      <span className="text-xs font-semibold tracking-wide uppercase text-indigo-600">
                        {step.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {step.description}
                      </span>
                    </span>
                  </button>
                </>
              ) : (
                <>
                  {stepIdx !== steps.length - 1 ? (
                    <div
                      className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
                      aria-hidden="true"
                    />
                  ) : null}
                  <button className="relative flex items-start group text-left">
                    <span className="h-9 flex items-center" aria-hidden="true">
                      <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                        <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300" />
                      </span>
                    </span>
                    <span className="ml-4 min-w-0 flex flex-col">
                      <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">
                        {step.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {step.description}
                      </span>
                    </span>
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
