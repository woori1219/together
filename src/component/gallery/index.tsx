import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ArrowLeft from "../../icons/angle-left-sm.svg?react"
import { LazyDiv } from "../lazyDiv"
import { Button } from "../button"
import { useModal } from "../modal"
import { GALLERY_IMAGES } from "../../images"

const DRAG_SENSITIVITY = 15
const SWIPE_THRESHOLD = 30
const CLOSE_SWIPE_THRESHOLD = 70
const DOUBLE_TAP_THRESHOLD = 280

type Status =
  | "stationary"
  | "clicked"
  | "clickCanceled"
  | "dragging"
  | "dragEnding"
  | "moving-left"
  | "moving-right"

type DragOption = {
  startingClientX: number
  startingClientY: number
  currentTranslateX: number
}

type ClickMove = "left" | "right" | null

const moveIndex = (idx: number, move: number) => {
  return (idx + move + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
}

const PhotoViewer = ({ initialIndex }: { initialIndex: number }) => {
  const { closeModal } = useModal()
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoomed, setZoomed] = useState(false)
  const touchStartXRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)
  const lastTapTsRef = useRef(0)

  const prev = useCallback(() => {
    setCurrentIndex((idx) => moveIndex(idx, -1))
    setZoomed(false)
  }, [])

  const next = useCallback(() => {
    setCurrentIndex((idx) => moveIndex(idx, 1))
    setZoomed(false)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prev()
      } else if (e.key === "ArrowRight") {
        next()
      } else if (e.key === "Escape") {
        closeModal()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [closeModal, next, prev])

  const image = GALLERY_IMAGES[currentIndex]

  return (
    <div
      className="photo-viewer"
      onTouchStart={(e) => {
        touchStartXRef.current = e.targetTouches[0].clientX
        touchStartYRef.current = e.targetTouches[0].clientY
      }}
      onTouchEnd={(e) => {
        const startX = touchStartXRef.current
        const startY = touchStartYRef.current
        if (startX === null || startY === null) return

        const endX = e.changedTouches[0].clientX
        const endY = e.changedTouches[0].clientY
        const diffX = endX - startX
        const diffY = endY - startY

        const absX = Math.abs(diffX)
        const absY = Math.abs(diffY)

        if (absY >= CLOSE_SWIPE_THRESHOLD && absY > absX) {
          closeModal()
          return
        }

        if (absX >= SWIPE_THRESHOLD && absX > absY) {
          if (diffX > 0) {
            prev()
          } else {
            next()
          }
          return
        }

        if (absX < 10 && absY < 10) {
          const now = Date.now()
          if (now - lastTapTsRef.current <= DOUBLE_TAP_THRESHOLD) {
            setZoomed((z) => !z)
            lastTapTsRef.current = 0
          } else {
            lastTapTsRef.current = now
          }
        }
      }}
    >
      <div className="photo-view-wrapper">
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={image.sizes}
          alt={image.alt}
          draggable={false}
          className={zoomed ? "zoomed" : undefined}
          onDoubleClick={() => setZoomed((z) => !z)}
        />
      </div>
      <button
        type="button"
        className="photo-nav left"
        onClick={prev}
        aria-label="이전 사진 보기"
      >
        <ArrowLeft className="arrow" />
      </button>
      <button
        type="button"
        className="photo-nav right"
        onClick={next}
        aria-label="다음 사진 보기"
      >
        <ArrowLeft className="arrow" />
      </button>
      <div className="photo-view-dots" aria-hidden="true">
        {GALLERY_IMAGES.map((_, idx) => (
          <span key={idx} className={idx === currentIndex ? "dot active" : "dot"} />
        ))}
      </div>
    </div>
  )
}

const CAROUSEL_ITEMS = GALLERY_IMAGES.map((item, idx) => (
  <div className="carousel-item" key={idx}>
    <img
      src={item.src}
      srcSet={item.srcSet}
      sizes={item.sizes}
      draggable={false}
      alt={item.alt}
      loading={idx === 0 ? "eager" : "lazy"}
      decoding="async"
    />
  </div>
))

export const Gallery = () => {
  const { openModal, closeModal } = useModal()
  const carouselRef = useRef<HTMLDivElement>({} as HTMLDivElement)

  const openPhotoView = useCallback(
    (idx: number) => {
      openModal({
        className: "photo-view-modal",
        closeOnClickBackground: true,
        content: <PhotoViewer initialIndex={idx} />,
      })
    },
    [openModal],
  )

  useEffect(() => {
    GALLERY_IMAGES.forEach((image) => {
      const img = new Image()
      img.src = image.src
      img.srcset = image.srcSet
      img.sizes = image.sizes
    })
  }, [])

  const [slide, _setSlide] = useState(0)
  const slideRef = useRef(0)
  const setSlide = (slide: number) => {
    _setSlide(slide)
    slideRef.current = slide
  }

  const [status, _setStatus] = useState<Status>("stationary")
  const statusRef = useRef<Status>("stationary")
  const setStatus = (status: Status) => {
    _setStatus(status)
    statusRef.current = status
  }

  const [dragOption, _setDragOption] = useState<DragOption>({
    startingClientX: 0,
    startingClientY: 0,
    currentTranslateX: 0,
  })
  const dragOptionRef = useRef<DragOption>({
    startingClientX: 0,
    startingClientY: 0,
    currentTranslateX: 0,
  })
  const setDragOption = (dragOption: DragOption) => {
    _setDragOption(dragOption)
    dragOptionRef.current = dragOption
  }

  const [moveOption, setMoveOption] = useState({
    srcIdx: 0,
    dstIdx: 0,
  })

  const clickMoveRef = useRef<ClickMove>(null)
  const setClickMove = (clickMove: ClickMove) => {
    clickMoveRef.current = clickMove
  }

  const click = (
    status: Status,
    clientX: number,
    clientY: number,
    carouselWidth: number,
  ) => {
    if (status !== "stationary") return
    setDragOption({
      startingClientX: clientX,
      startingClientY: clientY,
      currentTranslateX: -carouselWidth,
    })
    setStatus("clicked")
  }

  const dragging = useCallback(
    (dragOption: DragOption, clientX: number, carouselWidth: number) => {
      let moveTranslateX = clientX - dragOption.startingClientX

      if (moveTranslateX > carouselWidth) {
        moveTranslateX = carouselWidth
      } else if (moveTranslateX < -carouselWidth) {
        moveTranslateX = -carouselWidth
      }

      setDragOption({
        ...dragOption,
        currentTranslateX: moveTranslateX - carouselWidth,
      })
    },
    [],
  )

  const dragEnd = useCallback(
    (slide: number, dragOption: DragOption, carouselWidth: number) => {
      let move = 0
      if (dragOption.currentTranslateX < -carouselWidth * 1.1) {
        move = 1
      } else if (dragOption.currentTranslateX > -carouselWidth * 0.9) {
        move = -1
      }

      setDragOption({
        ...dragOption,
        currentTranslateX: -carouselWidth * (move + 1),
      })

      setStatus("dragEnding")

      setTimeout(() => {
        setDragOption({
          ...dragOption,
          currentTranslateX: -carouselWidth,
        })
        setStatus("stationary")
        setSlide(moveIndex(slide, move))
      }, 300)
    },
    [],
  )

  const move = useCallback((srcIdx: number, dstIdx: number) => {
    setSlide(dstIdx)
    if (srcIdx < dstIdx) {
      setStatus("moving-right")
    } else {
      setStatus("moving-left")
    }

    setMoveOption({ srcIdx, dstIdx })

    setTimeout(() => {
      setClickMove(null)
      setStatus("stationary")
    }, 300)
  }, [])

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const status = statusRef.current

      if (status === "clicked") {
        setStatus("dragging")
      } else if (status === "dragging") {
        e.preventDefault()
        dragging(
          dragOptionRef.current,
          e.clientX,
          carouselRef.current.clientWidth,
        )
      }
    },
    [dragging],
  )

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      const status = statusRef.current

      if (status === "clicked") {
        e.preventDefault()
        const xMove =
          e.targetTouches[0].clientX - dragOptionRef.current.startingClientX
        const yMove =
          e.targetTouches[0].clientY - dragOptionRef.current.startingClientY
        if (Math.abs(xMove) > DRAG_SENSITIVITY) {
          setStatus("dragging")
        } else if (Math.abs(yMove) > DRAG_SENSITIVITY) {
          setStatus("clickCanceled")
        }
      } else if (status === "dragging") {
        e.preventDefault()
        dragging(
          dragOptionRef.current,
          e.targetTouches[0].clientX,
          carouselRef.current.clientWidth,
        )
      }
    },
    [dragging],
  )

  const onMouseTouchUp = useCallback(() => {
    const status = statusRef.current
    const clickMove = clickMoveRef.current
    const slide = slideRef.current

    if (status === "clicked") {
      if (clickMove === "left") {
        move(slide, moveIndex(slide, -1))
      } else if (clickMove === "right") {
        move(slide, moveIndex(slide, 1))
      } else {
        setStatus("stationary")
        openPhotoView(slide)
      }
    } else if (status === "dragging") {
      dragEnd(slide, dragOptionRef.current, carouselRef.current.clientWidth)
    } else if (status === "clickCanceled") {
      setStatus("stationary")
    }
  }, [dragEnd, move, openPhotoView])

  useEffect(() => {
    const carouselElement = carouselRef.current

    window.addEventListener("mousemove", onMouseMove)
    carouselElement.addEventListener("touchmove", onTouchMove)
    window.addEventListener("mouseup", onMouseTouchUp)
    window.addEventListener("touchend", onMouseTouchUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      carouselElement.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("mouseup", onMouseTouchUp)
      window.removeEventListener("touchend", onMouseTouchUp)
    }
  }, [onMouseMove, onTouchMove, onMouseTouchUp])

  const onIndicatorClick = useCallback(
    (status: Status, srcIdx: number, dstIdx: number) => {
      if (status !== "stationary" || srcIdx === dstIdx) return
      move(srcIdx, dstIdx)
    },
    [move],
  )

  const transformStyle = useMemo(() => {
    switch (status) {
      case "dragging":
      case "dragEnding":
        return { transform: `translateX(${dragOption.currentTranslateX}px)` }
      default:
        return {}
    }
  }, [status, dragOption])

  const transformClass = useMemo(() => {
    const className = "carousel-list"
    switch (status) {
      case "dragEnding":
        return className + " transitioning"
      case "moving-left":
        return className + " moving-left"
      case "moving-right":
        return className + " moving-right"
      default:
        return className
    }
  }, [status])

  return (
    <LazyDiv className="card gallery">
      <h2 className="english">Gallery</h2>
      <div className="carousel-wrapper">
        <div
          className="carousel"
          ref={carouselRef}
          onMouseDown={(e) =>
            click(
              statusRef.current,
              e.clientX,
              e.clientY,
              e.currentTarget.clientWidth,
            )
          }
          onTouchStart={(e) =>
            click(
              statusRef.current,
              e.targetTouches[0].clientX,
              e.targetTouches[0].clientY,
              e.currentTarget.clientWidth,
            )
          }
        >
          <div className={transformClass} style={transformStyle}>
            {["dragging", "dragEnding"].includes(status) && [
              ...(slide === 0
                ? [CAROUSEL_ITEMS[CAROUSEL_ITEMS.length - 1]]
                : []),
              ...CAROUSEL_ITEMS.slice(slide === 0 ? 0 : slide - 1, slide + 2),
              ...(slide === CAROUSEL_ITEMS.length - 1
                ? [CAROUSEL_ITEMS[0]]
                : []),
            ]}
            {status === "moving-right" &&
              CAROUSEL_ITEMS.slice(moveOption.srcIdx, moveOption.dstIdx + 1)}
            {status === "moving-left" &&
              CAROUSEL_ITEMS.slice(moveOption.dstIdx, moveOption.srcIdx + 1)}
            {["stationary", "clicked", "clickCanceled"].includes(status) &&
              CAROUSEL_ITEMS[slide]}
          </div>
          <div className="carousel-control">
            <button
              type="button"
              className="control left"
              aria-label="이전 사진"
              onMouseDown={() => {
                if (statusRef.current === "stationary") setClickMove("left")
              }}
              onTouchStart={() => {
                if (statusRef.current === "stationary") setClickMove("left")
              }}
            >
              <ArrowLeft className="arrow" />
            </button>
            <button
              type="button"
              className="control right"
              aria-label="다음 사진"
              onMouseDown={() => {
                if (statusRef.current === "stationary") setClickMove("right")
              }}
              onTouchStart={() => {
                if (statusRef.current === "stationary") setClickMove("right")
              }}
            >
              <ArrowLeft className="arrow right" />
            </button>
          </div>
        </div>
        <div className="carousel-indicator">
          {CAROUSEL_ITEMS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`indicator${idx === slide ? " active" : ""}`}
              aria-label={`${idx + 1}번 사진 보기`}
              aria-current={idx === slide}
              onClick={() =>
                onIndicatorClick(statusRef.current, slideRef.current, idx)
              }
            />
          ))}
        </div>
      </div>

      <div className="break" />

      <Button
        onClick={() =>
          openModal({
            className: "all-photo-modal",
            closeOnClickBackground: true,
            header: <div className="title">사진 전체보기</div>,
            content: (
              <>
                <div className="photo-list">
                  {GALLERY_IMAGES.map((image, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="photo-button"
                      aria-label={`${idx + 1}번 사진 크게 보기`}
                      onClick={() => {
                        if (idx !== slideRef.current) {
                          move(slideRef.current, idx)
                        }
                        closeModal()
                        setTimeout(() => {
                          openPhotoView(idx)
                        }, 0)
                      }}
                    >
                      <img
                        src={image.src}
                        srcSet={image.srcSet}
                        sizes={image.sizes}
                        alt={image.alt}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  ))}
                </div>
                <div className="break" />
              </>
            ),
            footer: (
              <Button
                buttonStyle="style2"
                className="bg-light-grey-color text-dark-color"
                onClick={closeModal}
              >
                닫기
              </Button>
            ),
          })
        }
      >
        사진 전체보기
      </Button>
    </LazyDiv>
  )
}
