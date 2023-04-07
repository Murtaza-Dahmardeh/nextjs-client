import { PaperClipIcon } from "@heroicons/react/20/solid";
import Header from "@components/components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { readUser } from '../../redux/actions';

interface User {
  bio: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  id: number;
  email: string;
  title: string;
  company: string;
}

function UserDetails({
  readUserAction,
  userInfo
}: any) {
  const [profileSrc, setProfileSrc] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      readUserAction(id);
    }
  }, [id]);

  useEffect(() => {
    if (userInfo.profile_picture) {
      fetch(`http://localhost:8000/api/photos/${userInfo.profile_picture}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch image');
          }
          return response.blob();
        })
        .then(blob => {
          const imageUrl = URL.createObjectURL(blob);
          setProfileSrc(imageUrl);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [userInfo]);
  
  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
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
      <div className="">
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div
                className="flex items-center justify-between gap-x-6"
              >
                <div>
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    User Information
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    User details and personal Information.
                  </p>
                </div>

                <img
                  className="h-16 w-16 rounded-md"
                  src={profileSrc == "" ? "https://placehold.co/400x400?text=Please+Upload" : profileSrc}
                  alt=""
                />
              </div>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {userInfo ? userInfo.first_name + " " + userInfo.last_name: ""}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Job Title
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {userInfo ? userInfo.title: ""}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Company
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {userInfo ? userInfo.company: ""}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {userInfo ? userInfo.email: ""}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Phone
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {userInfo ? userInfo.phone_number: ""}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">About</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {userInfo ? userInfo.bio: ""}
                  </dd>
                </div>

              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({ user }: any) => {
  const { loading, notification, userInfo, action } = user;
  return { loading, notification, userInfo, action };
};

export default connect(mapStateToProps, {
  readUserAction: readUser,
})(UserDetails);