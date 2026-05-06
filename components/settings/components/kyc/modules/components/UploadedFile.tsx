import React from "react";
import { CiFileOn } from "react-icons/ci";
import { formatFileSize, getFileExtension } from "@/lib/utils";

import { RiDeleteBinLine } from "react-icons/ri";

import { FaCircleCheck } from "react-icons/fa6";
import { FormLabel } from "@/components/ui/form";

interface IUploadedFileProps {
  file: File;
  deleteItem: () => void;
  label: string;
}

const UploadedFile = ({ file, deleteItem, label }: IUploadedFileProps) => {
  return (
    <div className="">
      <FormLabel className="text-black-charcoal tracking-[0.154px] font-medium text-sm cursor-pointer">
        {label}
      </FormLabel>

      <div className="shadow-and-stroke bg-white w-full flex justify-between items-center rounded-xl p-4 my-3 h-fit">
        <div className="flex">
          <div className="max-w-10 max-h-10 relative">
            <CiFileOn className="w-10 h-auto text-soft-400" />
            <div className="absolute uppercase bg-[#DF1C41] text-white p-px text-[10px] w-full text-center top-1/2 max-w-6 -translate-y-[35%] rounded left-1 font-medium">
              {getFileExtension(file.name)}
            </div>
          </div>

          <div className="flex flex-col ml-5">
            <p className="text-sm text-main-900 font-medium">
              {file.name.split(".")[0].length < 10
                ? file.name
                : file.name.split(".")[0].slice(0, 10) +
                  "..." +
                  getFileExtension(file.name)}
            </p>
            <div className="flex text-xs items-center gap-3 mt-1">
              <p className="tetx-sub-500 ">{formatFileSize(file.size)}</p>
              <p className="flex items-center gap-2">
                <FaCircleCheck className="text-success" /> Completed
              </p>
            </div>
          </div>
        </div>

        <button type="button" onClick={deleteItem}>
          <RiDeleteBinLine className="text-soft-500 text-xl" />
        </button>
      </div>
    </div>
  );
};

export default UploadedFile;
