"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { uploadProduct } from "./action";

const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
const maxFileSize = 2 * 1024 * 1024;

export default function AddProduct() {
  const [preview, SetPreview] = useState("");
  const [error, SetError] = useState("");

  // Check Image Type
  const isImage = (file: File): boolean => {
    return validImageTypes.includes(file.type);
  };

  // Check File Size
  const isValidSize = (file: File): booelan => {
    return file.size <= maxFileSize;
  };

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.files[0]);
    // image = jpg, jpeg, png
    // image size = 3mb under
    const {
      target: { files },
    } = event; // const files = event.target.files;
    if (!files) {
      return;
    }
    const file = files[0];

    if (isImage(file) && isValidSize(file)) {
      // file을 보여주기위해서는 URL이 필요함.
      // createObjectURL API는 파일이 저장된 메모리를 URL로 저장, 브라우저에만 존재함
      // 새로고침하면 메모리가 비워지고 해당 url은 사라짐.
      // blob:http://localhost:3000/d3f2781e-c7f0-440c-9b01-95d03f52b804 이런식으로 만들어줌
      const url = URL.createObjectURL(file);
      SetPreview(url);
    } else {
      if (!isImage(file)) {
        SetError("파일이 이미지가 아닙니다. jpeg, jpg, png 파일만 가능");
      }
      if (!isValidSize(file)) {
        SetError("파일 크기가 2MB를 초과합니다.");
      }
    }
  };
  return (
    <div>
      <form action={uploadProduct} className="p-5 flex flex-col gap-5">
        {/* htmlFor이라고 적어야하는 이유
        현재 JavaScript = React.js = Next.js 에서 작업하고 있고, for는 이미 JS안에서 예약된 키워드임 (if처럼 for loop)
        htmlFor="input의 id" */}
        <label
          htmlFor="photo"
          style={{ backgroundImage: `url(${preview})` }}
          className="bg-center bg-cover border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed "
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20 cursor-pointer" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
              </div>
            </>
          ) : null}
        </label>
        {error && <p className="text-red-500">Error! {error}</p>}

        {/* 
        -input에 id가 있으면 그 id를 위한 label을 만들 수 있음, 이 label은 input을 클릭하는 것과 같음 
        -input에 onChange리스너가 있으면, change될때마다 React.js가 이 함수를 실행함
        */}

        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
        />
        <Input name="title" required placeholder="제목" type="text" />
        <Input name="price" required placeholder="가격" type="text" />
        <Input
          name="description"
          required
          placeholder="자세한 설명"
          type="text"
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
