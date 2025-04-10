export const images = [
    {
      "url": "https://wallpapers.com/images/high/funny-discord-profile-pictures-tmkx3mqxurekfr4y.webp",
      "description": "Funny cartoon character profile picture"
    },
    {
      "url": "https://wallpapers.com/images/high/funny-discord-profile-pictures-be68rtor622t4ftu.webp",
      "description": "Donald Duck image"
    },

  ]
  

  export function randomProfileImageGenerator(){
    const index = Math.floor(Math.random() * images.length);
    return images[index]
  }