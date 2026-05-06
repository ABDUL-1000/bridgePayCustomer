"use client";
import React from "react";
import CustomImage from "../../../../ui/custom-image";
import { IUser } from "@/shared-types";
import { CustomizableButton } from "../../../../shared/CustomButton";
import { profileAvatarImg2 } from "@/public/main/svg";

export interface UserMenuButtonProps {
  user: IUser;
  onClick: () => void;
}

const UserMenuButton: React.FC<UserMenuButtonProps> = ({ user, onClick }) => {
  return (
    <CustomizableButton onClick={onClick}>
      <CustomImage
        src={  profileAvatarImg2}
        alt={`${user.firstname} ${user.lastname}`}
        priority
        className="w-[25px] md:w-[43px] h-auto rounded-full object-cover"
      />
    </CustomizableButton>
  );
};

export default UserMenuButton;
