/* This example requires Tailwind CSS v2.0+ */
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

const BreadCrumbs: React.FC<{ crumbs: Array<String> }> = ({ crumbs }) => {
  return (
    <div>
      <nav className="sm:hidden" aria-label="Back">
        <a
          href="#"
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ChevronLeftIcon
            className="flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Back
        </a>
      </nav>
      <nav className="hidden sm:flex" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-4">
          {crumbs.map((crumb, index) => {
            let classes =
              "text-sm font-medium text-gray-500 hover:text-gray-700";
            if (index > 0) {
              classes += " ml-4";
            }
            return (
              <li key={index}>
                <div className="flex">
                  {index > 0 ? (
                    <ChevronRightIcon
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  ) : null}
                  <a href="#" className={classes}>
                    {crumb}
                  </a>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

const PageHeading: React.FC<{
  pageTitle: String;
  crumbs: Array<String>;
  className?: String;
}> = ({ children, pageTitle, crumbs, className }) => {
  return (
    <div className={"pl-8 pt-6 bg-white pb-5 drop-shadow-sm " + className}>
      <BreadCrumbs crumbs={crumbs} />
      <div className="mt-2 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {pageTitle}
          </h2>
        </div>
        <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageHeading;
