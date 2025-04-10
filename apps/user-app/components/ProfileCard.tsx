"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/ui"
import { randomProfileImageGenerator } from "../helper/randomProfileGenerator"

export interface ProfileCardProps {
  profilePic?: string
  initialName: string
  email: string
  bg_color?: string
  className?: string
  profileType: "image" | "initials" | "random"
}

function getProfileAvatar(
  profileType: "image" | "initials" | "random",
  profilePic?: string,
  initialName?: string
): { src?: string; fallback?: string; alt?: string } {
  switch (profileType) {
    case "image":
      return { src: profilePic, fallback: undefined, alt: initialName }

    case "initials":
      if (initialName) {
        const nameArray = initialName.split(" ")
        const initials =
          nameArray[0]?.charAt(0).toUpperCase() +
          (nameArray[1]?.charAt(0).toUpperCase() || "")
        return { fallback: initials, alt: initials }
      }
      break

    case "random": {
      const randomImage = randomProfileImageGenerator()
      if(randomImage){
          return {
            src: randomImage.url,
            fallback: undefined,
            alt: randomImage.description
          }
      }
      break
    }
  }
  return {}
}

const ProfileCard = ({
  profilePic,
  className,
  initialName,
  email,
  profileType,
  bg_color = "bg-muted"
}: ProfileCardProps) => {
  const { src, fallback, alt } = getProfileAvatar(profileType, profilePic, initialName)

  return (
    <div className={`flex items-center p-4 ${className} ${bg_color}` }>
      <div className="flex items-center gap-3">
        <Avatar className={`h-10 w-10 ${profileType==="initials" ? "bg-black text-white" : ""} `}>
          {src && <AvatarImage src={src} alt={alt || initialName} />}
          {fallback && <AvatarFallback>{fallback}</AvatarFallback>}
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{initialName}</span>
          <span className="text-xs text-gray-500">{email}</span>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard