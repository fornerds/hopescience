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
    </section>
  );
};
