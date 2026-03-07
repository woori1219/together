/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react"
import { loadKakaoSdk, loadNaverSdk } from "../store"
import nmapIcon from "../../icons/nmap-icon.png"
import knaviIcon from "../../icons/knavi-icon.png"
import tmapIcon from "../../icons/tmap-icon.png"
import LockIcon from "../../icons/lock-icon.svg?react"
import UnlockIcon from "../../icons/unlock-icon.svg?react"
import {
  KMAP_PLACE_ID,
  LOCATION,
  NMAP_PLACE_ID,
  WEDDING_HALL_POSITION,
} from "../../const"
import { NAVER_MAP_CLIENT_ID } from "../../env"

const checkDevice = () => {
  const userAgent = window.navigator.userAgent
  if (userAgent.match(/(iPhone|iPod|iPad)/)) {
    return "ios"
  } else if (userAgent.match(/(Android)/)) {
    return "android"
  } else {
    return "other"
  }
}

const NavigationButtons = () => {
  return (
    <div className="navigation">
      <button
        type="button"
        aria-label="네이버 지도 열기"
        onClick={() => {
          switch (checkDevice()) {
            case "ios":
            case "android":
              window.open(`nmap://place?id=${NMAP_PLACE_ID}`, "_self")
              break
            default:
              window.open(
                `https://map.naver.com/p/entry/place/${NMAP_PLACE_ID}`,
                "_blank",
              )
              break
          }
        }}
      >
        <img src={nmapIcon} alt="naver-map-icon" />
        네이버 지도
      </button>
      <button
        type="button"
        aria-label="카카오 내비 열기"
        onClick={async () => {
          switch (checkDevice()) {
            case "ios":
            case "android": {
              const kakao = await loadKakaoSdk()
              if (kakao) {
                kakao.Navi.start({
                  name: LOCATION,
                  x: WEDDING_HALL_POSITION[0],
                  y: WEDDING_HALL_POSITION[1],
                  coordType: "wgs84",
                })
              } else {
                alert("카카오 SDK를 불러오지 못했습니다.")
              }
              break
            }
            default:
              window.open(`https://map.kakao.com/link/map/${KMAP_PLACE_ID}`, "_blank")
              break
          }
        }}
      >
        <img src={knaviIcon} alt="kakao-navi-icon" />
        카카오 내비
      </button>
      <button
        type="button"
        aria-label="티맵 열기"
        onClick={() => {
          window.open("https://tmap.life/cf177df7", "_blank")
        }}
      >
        <img src={tmapIcon} alt="t-map-icon" />
        티맵
      </button>
    </div>
  )
}

const NaverMap = ({ naver }: { naver: any }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [locked, setLocked] = useState(true)
  const [showLockMessage, setShowLockMessage] = useState(false)
  const lockMessageTimeout = useRef<number | null>(null)

  useEffect(() => {
    if (!naver) return

    const map = new naver.maps.Map(ref.current, {
      center: WEDDING_HALL_POSITION,
      zoom: 17,
    })
    new naver.maps.Marker({ position: WEDDING_HALL_POSITION, map })

    return () => {
      map.destroy()
    }
  }, [naver])

  return (
    <div className="map-wrapper">
      {locked && (
        <div
          className="lock"
          onTouchStart={() => {
            setShowLockMessage(true)
            if (lockMessageTimeout.current !== null) {
              clearTimeout(lockMessageTimeout.current)
            }
            lockMessageTimeout.current = window.setTimeout(
              () => setShowLockMessage(false),
              3000,
            )
          }}
          onMouseDown={() => {
            setShowLockMessage(true)
            if (lockMessageTimeout.current !== null) {
              clearTimeout(lockMessageTimeout.current)
            }
            lockMessageTimeout.current = window.setTimeout(
              () => setShowLockMessage(false),
              3000,
            )
          }}
        >
          {showLockMessage && (
            <div className="lock-message">
              <LockIcon /> 자물쇠 버튼을 눌러
              <br />
              터치 잠금 해제 후 확대 및 이동해 주세요.
            </div>
          )}
        </div>
      )}
      <button
        type="button"
        aria-label={locked ? "지도 터치 잠금 해제" : "지도 터치 잠금 설정"}
        className={"lock-button" + (locked ? "" : " unlocked")}
        onClick={() => {
          if (lockMessageTimeout.current !== null) {
            clearTimeout(lockMessageTimeout.current)
          }
          setShowLockMessage(false)
          setLocked((prev) => !prev)
        }}
      >
        {locked ? <LockIcon /> : <UnlockIcon />}
      </button>
      <div className="map-inner" ref={ref}></div>
    </div>
  )
}

export const Map = () => {
  const [naver, setNaver] = useState<any>(null)
  const [mapLoading, setMapLoading] = useState(false)
  const [mapUnavailable, setMapUnavailable] = useState(!NAVER_MAP_CLIENT_ID)

  useEffect(() => {
    if (!NAVER_MAP_CLIENT_ID) {
      setMapUnavailable(true)
      return
    }
    let cancelled = false

    const loadMap = async () => {
      setMapLoading(true)
      try {
        const loadedNaver = await loadNaverSdk()
        if (cancelled) return

        if (loadedNaver?.maps) {
          setNaver(loadedNaver)
          setMapUnavailable(false)
        } else {
          setMapUnavailable(true)
        }
      } catch {
        if (!cancelled) {
          setMapUnavailable(true)
        }
      } finally {
        if (!cancelled) {
          setMapLoading(false)
        }
      }
    }

    loadMap()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      {!mapUnavailable && (
        <>
          {mapLoading && (
            <div className="map-fallback" role="status" aria-live="polite">
              <div className="title">지도 불러오는 중...</div>
              <div className="description">잠시만 기다려 주세요.</div>
            </div>
          )}
          {naver && <NaverMap naver={naver} />}
        </>
      )}
      {mapUnavailable && (
        <div className="map-fallback" role="status" aria-live="polite">
          <div className="title">지도 로딩에 실패했어요.</div>
          <div className="description">
            네이버 지도 API 연결이 원활하지 않아 길찾기 버튼으로 안내합니다.
          </div>
        </div>
      )}
      <NavigationButtons />
    </>
  )
}
