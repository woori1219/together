import {
  BRIDE_FULLNAME,
  GROOM_FULLNAME,
  LOCATION,
  SHARE_ADDRESS,
  SHARE_ADDRESS_TITLE,
  WEDDING_DATE,
  WEDDING_DATE_FORMAT,
} from "../../const"
import sharePreviewImage from "../../images/share-preview.jpg"
import { useState } from "react"
import ktalkIcon from "../../icons/ktalk-icon.png"
import { LazyDiv } from "../lazyDiv"
import { loadKakaoSdk } from "../store"

const baseUrl = import.meta.env.BASE_URL
const toAbsoluteUrl = (url: string) => new URL(url, window.location.href).href

export const ShareButton = () => {
  const [loading, setLoading] = useState(false)
  return (
    <LazyDiv className="footer share-button" id="share-section">
      <button
        id="share-action-button"
        type="button"
        aria-label="카카오톡으로 청첩장 공유하기"
        className="ktalk-share"
        onClick={async () => {
          if (loading) return
          setLoading(true)
          try {
            const kakao = await loadKakaoSdk()
            if (!kakao) {
              alert("카카오 공유 SDK를 불러오지 못했습니다.")
              return
            }

            const siteUrl = toAbsoluteUrl(baseUrl)
            const imageUrl = toAbsoluteUrl(sharePreviewImage)

            kakao.Share.sendDefault({
              objectType: "location",
              address: SHARE_ADDRESS,
              addressTitle: SHARE_ADDRESS_TITLE,
              content: {
                title: `${GROOM_FULLNAME} ❤️ ${BRIDE_FULLNAME}의 결혼식에 초대합니다.`,
                description:
                  WEDDING_DATE.format(WEDDING_DATE_FORMAT) + "\n" + LOCATION,
                imageUrl,
                link: {
                  mobileWebUrl: siteUrl,
                  webUrl: siteUrl,
                },
              },
              buttons: [
                {
                  title: "초대장 보기",
                  link: {
                    mobileWebUrl: siteUrl,
                    webUrl: siteUrl,
                  },
                },
              ],
            })
          } finally {
            setLoading(false)
          }
        }}
      >
        <img src={ktalkIcon} alt="ktalk-icon" />{" "}
        {loading ? "공유 준비 중..." : "카카오톡으로 공유하기"}
      </button>
    </LazyDiv>
  )
}
