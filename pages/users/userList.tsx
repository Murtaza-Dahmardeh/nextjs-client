import { Fragment, useEffect, useState } from "react";
import {
  BriefcaseIcon,
  ChevronDownIcon,
  AtSymbolIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
  DevicePhoneMobileIcon,
  TrashIcon
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { connect } from "react-redux";
import { readUsers, deleteUser } from '../../redux/actions';
import Link from "next/link";
import toast from 'react-hot-toast';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function List({
  listUsers,
  users,
  loading,
  deleteAction,
  notification,
  action
}: any) {
  const [userlist, setUserList] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        await listUsers();
      } catch (error) {
        console.error(error);
      }
    }
    if (!loading) {
      fetchUsers();
    }

  }, []);

  useEffect(() => {
    setUserList(users);
  }, [users]);

  useEffect(() => {
    if(action === "DELETE_USER_SUCCESS") {
      toast.success(notification);
    } else if (action === "DELETE_USER_SUCCESS") {
      toast.error(notification);
    }
  }, [notification]);

  async function onDeleteUserClick(user: any) {
    await deleteAction(user.id);
    setUserList(userlist.filter((list:any) => list.id !== user.id))
  }


  return (
    <div className="isolate h-screen bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      {userlist.map((user: any) => (
        <div className="border-b border-gray-600 bg-white px-4 py-4 sm:px-6 sm:py-8 lg:px-8" key={user.id}>
          <div className="">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  {user.first_name} {" "} {user.last_name}
                </h2>
                <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <BriefcaseIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    {user.title}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <MapPinIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    {user.company}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <DevicePhoneMobileIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    {user.phone_number}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <AtSymbolIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex lg:ml-4 lg:mt-0">
                <span className="hidden sm:block">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <PencilIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Link key={user.id} href={`/users/create/${user.id}`} className="block text-sm text-gray-700">
                      Edit
                    </Link>
                  </button>
                </span>

                <span className="ml-3 hidden sm:block">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <LinkIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Link key={user.id} href={`/users/view/${user.id}`} className="block text-sm text-gray-700">
                      View
                    </Link>
                  </button>
                </span>

                <span className="sm:ml-3">
                  <button
                    type="button"
                    onClick={() => onDeleteUserClick(user)}
                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <TrashIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Delete
                  </button>
                </span>

                {/* Dropdown */}
                <Menu as="div" className="relative ml-3 sm:hidden">
                  <Menu.Button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400">
                    More
                    <ChevronDownIcon
                      className="-mr-1 ml-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 -mr-1 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link key={user.id} href={`/users/create/${user.id}`} className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}>
                            Edit
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link key={user.id} href={`/users/view/${user.id}`} className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}>
                            View
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


const mapStateToProps = ({ user }: any) => {
  const { loading, notification, users, action } = user;
  return { loading, notification, users, action };
};

export default connect(mapStateToProps, {
  listUsers: readUsers,
  deleteAction: deleteUser
})(List);
