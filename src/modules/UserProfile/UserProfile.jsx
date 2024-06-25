import "./UserProfile.css";
import { useEffect } from "react";
import { user } from "../../store";
import { useParams } from "react-router-dom";
import avatorIcon from "../../icons/avatar-22.svg"
import emailIcon from "../../icons/mail-1.svg"
import phoneIcon from "../../icons/phone-2.svg"

export const UserProfile = () => {
  let { user_id } = useParams();
  const isLoading = user((state) => state.isLoading);
  const profile = user((state) => state.profile);
  const getUser = user((state) => state.getUser);

  useEffect(() => {
    getUser(user_id);
  }, []);

  return (
    <section className="admin-user-profile-section">
      {isLoading ? (
        <div className="admin-user-profile">
          <img
            className="admin-user-profile-image"
            src={avatorIcon}
            alt="사용자 프로필 이미지"
          />
          <div className="admin-user-profile-details">
            <div className="admin-user-profile-name">Loading...</div>
          </div>
        </div>
      ) : (
        <div className="admin-user-profile">
          <img
            className="admin-user-profile-image"
            src={avatorIcon}
            alt="사용자 프로필 이미지"
          />
          <div className="admin-user-profile-details">
            <div className="admin-user-profile-status">
              {profile
                ? profile.userType === "admin"
                  ? "관리자"
                  : "일반고객"
                : "일반고객"}
            </div>
            <div className="admin-user-profile-name">
              {profile ? profile.name : "홍길동"}
            </div>
          </div>
          <div className="admin-user-profile-contact-details">
            <div className="admin-user-profile-email">
              <img src={emailIcon} alt="이메일 이미지" />
              <span>{profile ? profile.email : "test@naver.com"}</span>
            </div>
            <div className="admin-user-profile-phone">
              <img src={phoneIcon} alt="휴대폰 이미지" />
              <span>{profile ? profile.phone : "010-0000-0000"}</span>
            </div>
          </div>
        </div>
      )}

      <div>
        <button className="admin-user-profile-delete-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22px"
            height="22px"
            viewBox="0 0 24 22"
            fill="none"
          >
            <path
              d="M10 12V17"
              stroke="#de3b40"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 12V17"
              stroke="#de3b40"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 7H20"
              stroke="#de3b40"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
              stroke="#de3b40"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
              stroke="#de3b40"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};
