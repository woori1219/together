import coverImage from "./cover.webp"
import coverImageSm from "./cover-sm.webp"
import image1 from "./image1.webp"
import image1Sm from "./image1-sm.webp"
import image2 from "./image2.webp"
import image2Sm from "./image2-sm.webp"
import image3 from "./image3.webp"
import image3Sm from "./image3-sm.webp"

export const COVER_IMAGE = {
  src: coverImage,
  srcSet: `${coverImageSm} 900w, ${coverImage} 1600w`,
  sizes: "(max-width: 980px) calc(100vw - 2rem), 480px",
  alt: "신랑 신부 웨딩 사진",
}

export type ResponsiveImage = {
  src: string
  srcSet: string
  sizes: string
  alt: string
}

const gallerySizes = "(max-width: 980px) calc(100vw - 3rem), 540px"

export const GALLERY_IMAGES: ResponsiveImage[] = [
  {
    src: image1,
    srcSet: `${image1Sm} 900w, ${image1} 1800w`,
    sizes: gallerySizes,
    alt: "웨딩 갤러리 사진 1",
  },
  {
    src: image2,
    srcSet: `${image2Sm} 900w, ${image2} 1800w`,
    sizes: gallerySizes,
    alt: "웨딩 갤러리 사진 2",
  },
  {
    src: image3,
    srcSet: `${image3Sm} 900w, ${image3} 1800w`,
    sizes: gallerySizes,
    alt: "웨딩 갤러리 사진 3",
  },
]
