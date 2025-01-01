import ModalButton from "@/components/modal-button";
import { PhotoIcon, UserIcon } from "@heroicons/react/24/solid";

export default async function ModalLoading() {
  return (
    <div className="absolute flex justify-center items-center z-50 w-full h-full bg-black bg-opacity-50 left-0 top-0">
      <ModalButton />

      <div className="max-w-screen-sm h-1/2 flex justify-center w-full bg-neutral-50 *:text-neutral-900">
        <div className="animate-pulse relative aspect-square w-full p-5 border-neutral-500 border-4 border-dashed  text-neutral-200 bg-neutral-700 flex justify-center items-center">
          <PhotoIcon className="h-28" />
        </div>
        <div className="animate-pulse flex flex-col">
          <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
            <div className="size-10 rounded-full overflow-hidden">
              <UserIcon />
            </div>
            <div className="animate-pulse bg-neutral-700 h-5 w-20 rounded-md" />
          </div>
          <div className="animate-pulse p-5 gap-2 flex flex-col *:rounded-md">
            <div className=" bg-neutral-700 h-5 w-10" />
            <div className=" bg-neutral-700 h-5 w-20" />
            <div className=" bg-neutral-700 h-5 w-30" />
          </div>
        </div>
      </div>
    </div>
  );
}
