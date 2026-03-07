const scrollToSection = (id: string) => {
  const target = document.getElementById(id)
  if (!target) return

  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}

const triggerShare = () => {
  const shareButton = document.getElementById("share-action-button")
  if (!shareButton) return
  shareButton.click()
}

export const QuickActions = () => {
  return (
    <div className="quick-actions" role="navigation" aria-label="Quick actions">
      <div className="quick-actions-inner">
        <button
          type="button"
          className="quick-action-button"
          onClick={() => scrollToSection("top-section")}
        >
          초대장
        </button>
        <button
          type="button"
          className="quick-action-button"
          onClick={() => scrollToSection("location-section")}
        >
          오시는 길
        </button>
        <button
          type="button"
          className="quick-action-button emphasize"
          onClick={triggerShare}
        >
          공유하기
        </button>
      </div>
    </div>
  )
}
