import { Fragment } from "react/jsx-runtime"
import {
  BRIDE_FULLNAME,
  BRIDE_INFO,
  BRIDE_FATHER,
  BRIDE_MOTHER,
  GROOM_FULLNAME,
  GROOM_INFO,
  GROOM_FATHER,
  GROOM_MOTHER,
  GROOM_TITLE,
  BRIDE_TITLE,
} from "../../const"
import { useModal } from "../modal"
import { Button } from "../button"
import { LazyDiv } from "../lazyDiv"
import PhoneIcon from "../../icons/phone-flip-icon.svg?react"
import EnvelopeIcon from "../../icons/envelope-icon.svg?react"

export const Invitation = () => {
  const { openModal, closeModal } = useModal()
  return (
    <LazyDiv className="card invitation">
      <h2>초대합니다</h2>

      <div className="break" />

      <div className="content">서로의 온기가 되어줄 두 사람이</div>
      <div className="content">사랑의 약속을 하려 합니다.</div>
      <div className="break" />
      <div className="content">귀한 걸음 하시어</div>
      <div className="content">축복해 주시면 감사하겠습니다.</div>

      <div className="break" />

      <div className="name">
        {GROOM_FATHER} · {GROOM_MOTHER}
        <span className="relation">
          의 <span className="relation-name">{GROOM_TITLE}</span>
        </span>{" "}
        {GROOM_FULLNAME}
      </div>
      <div className="name">
        {BRIDE_FATHER} · {BRIDE_MOTHER}
        <span className="relation">
          의 <span className="relation-name">{BRIDE_TITLE}</span>
        </span>{" "}
        {BRIDE_FULLNAME}
      </div>

      <div className="break" />

      <Button
        onClick={() => {
          openModal({
            className: "contact-modal",
            closeOnClickBackground: true,
            header: (
              <div className="title-group">
                <div className="title">축하 인사 전하기</div>
                <div className="subtitle">
                  전화, 문자메세지로 축하 인사를 전해보세요.
                </div>
              </div>
            ),
            content: (
              <>
                <div className="contact-info">
                  {GROOM_INFO.filter(({ phone }) => !!phone).map(
                    ({ relation, name, phone }) => (
                      <Fragment key={relation}>
                        <div className="relation">{relation}</div>
                        <div>{name}</div>
                        <div className="actions">
                          <button
                            type="button"
                            className="icon-button"
                            aria-label={`${name}에게 전화하기`}
                            onClick={() => {
                              window.open(`tel:${phone}`, "_self")
                            }}
                          >
                            <PhoneIcon className="flip icon" />
                          </button>
                          <button
                            type="button"
                            className="icon-button"
                            aria-label={`${name}에게 문자 보내기`}
                            onClick={() => {
                              window.open(`sms:${phone}`, "_self")
                            }}
                          >
                            <EnvelopeIcon className="icon" />
                          </button>
                        </div>
                      </Fragment>
                    ),
                  )}
                </div>
                <div className="contact-info">
                  {BRIDE_INFO.filter(({ phone }) => !!phone).map(
                    ({ relation, name, phone }) => (
                      <Fragment key={relation}>
                        <div className="relation">{relation}</div>
                        <div>{name}</div>
                        <div className="actions">
                          <button
                            type="button"
                            className="icon-button"
                            aria-label={`${name}에게 전화하기`}
                            onClick={() => {
                              window.open(`tel:${phone}`, "_self")
                            }}
                          >
                            <PhoneIcon className="flip icon" />
                          </button>
                          <button
                            type="button"
                            className="icon-button"
                            aria-label={`${name}에게 문자 보내기`}
                            onClick={() => {
                              window.open(`sms:${phone}`, "_self")
                            }}
                          >
                            <EnvelopeIcon className="icon" />
                          </button>
                        </div>
                      </Fragment>
                    ),
                  )}
                </div>
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
        }}
      >
        연락하기
      </Button>
    </LazyDiv>
  )
}
