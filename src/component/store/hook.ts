/* eslint-disable @typescript-eslint/no-explicit-any */

import { KAKAO_SDK_JS_KEY, NAVER_MAP_CLIENT_ID } from "../../env"

const baseUrl = import.meta.env.BASE_URL
const KAKAO_SDK_URL = `${baseUrl}/kakao_js_sdk/2.7.1/kakao.min.js`
const NAVER_MAP_URL = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`

const loadScriptOnce = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${src}"]`,
    ) as HTMLScriptElement | null

    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve()
        return
      }
      existing.addEventListener("load", () => resolve(), { once: true })
      existing.addEventListener("error", () => reject(new Error(src)), {
        once: true,
      })
      return
    }

    const script = document.createElement("script")
    script.src = src
    script.async = true
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true"
        resolve()
      },
      { once: true },
    )
    script.addEventListener("error", () => reject(new Error(src)), {
      once: true,
    })
    document.head.appendChild(script)
  })

export const loadNaverSdk = async () => {
  if (!NAVER_MAP_CLIENT_ID) return null

  const naver = (window as any).naver
  if (naver?.maps) return naver

  await loadScriptOnce(NAVER_MAP_URL)
  return (window as any).naver || null
}

export const loadKakaoSdk = async () => {
  if (!KAKAO_SDK_JS_KEY) return null

  const existing = (window as any).Kakao
  if (existing) {
    if (!existing.isInitialized()) {
      existing.init(KAKAO_SDK_JS_KEY)
    }
    return existing
  }

  await loadScriptOnce(KAKAO_SDK_URL)
  const kakao = (window as any).Kakao
  if (!kakao) return null

  if (!kakao.isInitialized()) {
    kakao.init(KAKAO_SDK_JS_KEY)
  }
  return kakao
}
