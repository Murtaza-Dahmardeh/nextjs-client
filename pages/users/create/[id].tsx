import { useState, useRef, Fragment, useEffect } from "react";
import { ChevronDownIcon, ExclamationTriangleIcon, PencilIcon } from "@heroicons/react/20/solid";
import { Dialog, Switch, Transition } from "@headlessui/react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';
import { PhotoIcon } from "@heroicons/react/24/outline";
import { connect } from "react-redux";
import { createUser, readUser, updateUser } from '@components/redux/actions';
import { canvasPreview } from '@components/components/canvasPreview'
import { useDebounceEffect } from '@components/components/useDebounceEffect'
import { useRouter } from 'next/router'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function Register({
  registerUserAction,
  userInfo,
  action,
  readUserAction,
  updateUserAction
}: any) {
  const [agreed, setAgreed] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  const [imgSrc, setImgSrc] = useState('');
  const [profileSrc, setProfileSrc] = useState('');
  const [profilePicName, setProfilePicName] = useState('');
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id !== "0" && id !== undefined) {
      readUserAction(id);
    }
  }, [id]);

  useEffect(() => {
    if (profilePicName != "") {
      fetch(`http://localhost:8000/api/photos/${profilePicName}`)
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
  }, [profilePicName]);

  useEffect(() => {
    if(action === "CREATE_USER_SUCCESS") {
      if (userInfo.id) {
        router.push(`/users/view/${userInfo.id}`)
      }
    } else if (action === "READ_USER_SUCCESS") {
      setFirstName(userInfo.first_name);
      setLastName(userInfo.last_name);
      setTitle(userInfo.title);
      setCompany(userInfo.company);
      setEmail(userInfo.email);
      setPhone(userInfo.phone_number);
      setBio(userInfo.bio);
      setProfilePicName(userInfo.profile_picture);
    }
  }, [userInfo]);

  function onUserRegister(event: { preventDefault: () => void; target: any; } | undefined) {
    if (event) {
      event.preventDefault(); // prevent the form from submitting normally
      const form = event.target; // get the form element
      const formData = new FormData(form); // create a new FormData object with the form data  
      formData.append('profile_picture', profilePicName);

      if (id !== "0" && id !== undefined) {
        formData.append('_method', 'PUT');
        updateUserAction(formData, id);
      } else {
        registerUserAction(formData);
      }
    }
  };



  function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
  ) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    )
  }

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 1))
  }

  function onDownloadCropClick() {
    if (!previewCanvasRef.current) {
      throw new Error('Crop canvas does not exist')
    }

    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob')
      }
      const formData = new FormData()
      formData.append('image', blob, 'image.jpg')

      fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      }).then(response => response.json())
        .then(data => {
          setProfilePicName(data.filename.replace('photos/', ''));
        })
    })
    setOpen(false);
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          1,
          0,
        )
      }
    },
    100,
    [completedCrop, 1, 0],
  )


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
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          User Registration Form
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Please fill all the requested information.
        </p>
      </div>
      <form
        id="createUserForm"
        onSubmit={onUserRegister}
        className="mx-auto mt-16 max-w-xl sm:mt-20"
      >
        <div
          className="flex items-center justify-center gap-x-6"
          style={{ marginBottom: "25px" }}
        >
          <img
            className="h-16 w-16 rounded-md"
            src={profileSrc == "" ? "https://placehold.co/400x400?text=Please+Upload" : profileSrc}
            alt=""
          />
          <div>
            <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">
              {firstName} {" "} {lastName}
            </h3>
            <p className="text-sm font-semibold leading-6 text-indigo-600">
              {title}
            </p>
            <span className="hidden sm:block">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PencilIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                Edit
              </button>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              First name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="first_name"
                id="first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Last name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="last_name"
                id="last-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="family-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Job Title
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                autoComplete="organization"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="company"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Company
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="company"
                id="company"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                autoComplete="organization"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="phone-number"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Phone number
            </label>
            <div className="relative mt-2.5">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <label htmlFor="country" className="sr-only">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                >
                  <option>AF</option>
                  <option>PK</option>
                  <option>IR</option>
                </select>
                <ChevronDownIcon
                  className="pointer-events-none absolute right-3 top-0 h-full w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="tel"
                name="phone_number"
                id="phone-number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              About Your Self
            </label>
            <div className="mt-2.5">
              <textarea
                name="bio"
                id="message"
                rows={4}
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <Switch.Group as="div" className="flex gap-x-4 sm:col-span-2">
            <div className="flex h-6 items-center">
              <Switch
                checked={agreed}
                onChange={setAgreed}
                className={classNames(
                  agreed ? "bg-indigo-600" : "bg-gray-200",
                  "flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                )}
              >
                <span className="sr-only">Agree to policies</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    agreed ? "translate-x-3.5" : "translate-x-0",
                    "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                  )}
                />
              </Switch>
            </div>
            <Switch.Label className="text-sm leading-6 text-gray-600">
              By selecting this, you agree to our{" "}
              <a href="#" className="font-semibold text-indigo-600">
                privacy&nbsp;policy
              </a>
              .
            </Switch.Label>
          </Switch.Group>
        </div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:justify-center">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                            Profile Picture Editor
                          </Dialog.Title>
                          <div className="mt-2">
                            {!!imgSrc ? (
                              <>
                                <ReactCrop
                                  crop={crop}
                                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                                  onComplete={(c) => setCompletedCrop(c)}
                                  aspect={1}
                                >
                                  <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={imgSrc}
                                    height={50}
                                    style={{ transform: `scale(${1}) rotate(${0}deg)`, maxHeight: '250px' }}
                                    onLoad={onImageLoad}
                                  />
                                </ReactCrop>
                                {!!completedCrop && (
                                  <>
                                    <div style={{ display: "none" }}>
                                      <canvas
                                        ref={previewCanvasRef}
                                        style={{
                                          border: '1px solid black',
                                          objectFit: 'contain',
                                          width: completedCrop.width,
                                          height: completedCrop.height,
                                        }}
                                      />
                                    </div>
                                    <div style={{ display: "none" }}>
                                      <button onClick={onDownloadCropClick}>Download Crop</button>
                                      <a
                                        ref={hiddenAnchorRef}
                                        download
                                        style={{
                                          position: 'absolute',
                                          top: '-200vh',
                                          visibility: 'hidden',
                                        }}
                                      >
                                        Hidden download
                                      </a>
                                    </div>
                                  </>
                                )}
                              </>
                            ) : (
                              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                      htmlFor="file-upload"
                                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                      <span>Upload a file</span>
                                      <input id="file-upload" name="profile_picture" type="file" className="sr-only" accept="image/*" onChange={onSelectFile} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                  </div>
                                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                        onClick={onDownloadCropClick}
                      >
                        Crop and Save
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <div className="mt-10">
          <button
            type="submit"
            disabled={!agreed}
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>

      </form>
    </div>
  );
}

const mapStateToProps = ({ user }: any) => {
  const { loading, notification, userInfo, action } = user;
  return { loading, notification, userInfo, action };
};

export default connect(mapStateToProps, {
  registerUserAction: createUser,
  readUserAction: readUser,
  updateUserAction: updateUser
})(Register);