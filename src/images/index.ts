import galleryMeta from "./gallery.meta.json"
import coverImage from "./cover.webp"
import coverImageSm from "./cover-sm.webp"

export type ResponsiveImage = {
  id: string
  src: string
  srcSet: string
  sizes: string
  alt: string
  caption: string
}

const allWebpImages = import.meta.glob("./*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>

const getImageSrc = (id: string) => allWebpImages[`./${id}.webp`]
const getImageSrcSm = (id: string) => allWebpImages[`./${id}-sm.webp`]

export const COVER_IMAGE = {
  src: coverImage,
  srcSet: `${coverImageSm} 900w, ${coverImage} 1600w`,
  sizes: "(max-width: 980px) calc(100vw - 2rem), 480px",
  alt: "신랑 신부 웨딩 사진",
}

const gallerySizes = "(max-width: 980px) calc(100vw - 3rem), 540px"

export const GALLERY_IMAGES: ResponsiveImage[] = galleryMeta.map((item) => {
  const src = getImageSrc(item.id)
  const srcSm = getImageSrcSm(item.id)

  if (!src || !srcSm) {
    throw new Error(`Missing gallery image files for id "${item.id}"`)
  }

  return {
    id: item.id,
    src,
    srcSet: `${srcSm} 900w, ${src} 1800w`,
    sizes: gallerySizes,
    alt: item.alt,
    caption: item.caption,
  }
})
