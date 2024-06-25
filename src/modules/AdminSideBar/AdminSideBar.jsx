import { Button } from "../../components/Button";
import "./AdminSideBar.css";
import { NavLink } from "react-router-dom";
import { auth } from "../../store";
import { useNavigate } from "react-router-dom";
import MainLogo from "../../images/main-logo.png";

export const AdminSideBar = () => {
  const { logout } = auth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <>
      <aside className="admin-sidebar" aria-label="Sidebar">
        <div className="admin-sidebar-inner">
          <NavLink to="/admin/users" className="admin-logo-link">
            <img
              src={MainLogo}
              alt="메인 로고"
              className="admin-logo-image"
            />
            <span className="admin-logo-text">희망과학심리상담센터</span>
          </NavLink>

          <ul className="admin-menu-list">
            <li>
              <NavLink
                to="/admin/users"
                className="admin-menu-item"
                activeclassname="active"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.3756 12.8172C10.009 12.8172 8.08984 10.8981 8.08984 8.53153V7.67439C8.08984 5.30781 10.009 3.38867 12.3756 3.38867C14.7421 3.38867 16.6613 5.30781 16.6613 7.67439V8.53153C16.6613 10.8981 14.7421 12.8172 12.3756 12.8172Z"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M20.9475 20.4525C20.9475 18.9096 19.9215 17.5527 18.4327 17.1473C16.8093 16.7042 14.5927 16.2456 12.3761 16.2456C10.1595 16.2456 7.94297 16.7042 6.31954 17.1473C4.83069 17.5527 3.80469 18.9096 3.80469 20.4525L3.80469 22.2456L20.9475 22.2456V20.4525Z"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                </svg>
                <span className="admin-menu-label">회원관리</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/service"
                className="admin-menu-item"
                activeclassname="active"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.0887 3.18872L4.66016 3.18872L4.66016 22.0459L20.0887 22.0459L20.0887 3.18872Z"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M14.9453 7.47437H16.6596"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M14.9453 10.9028H16.6596"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M8.08984 14.3315L16.6613 14.3315"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M8.08984 17.76L16.6613 17.76"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M11.5184 7.47437L8.08984 7.47437V10.9029H11.5184V7.47437Z"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                </svg>
                <span className="admin-menu-label">서비스관리</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/QnA"
                className="admin-menu-item"
                activeclassname="active"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.51897 7.27427C6.46575 7.27427 7.23326 6.50676 7.23326 5.55999C7.23326 4.61321 6.46575 3.8457 5.51897 3.8457C4.5722 3.8457 3.80469 4.61321 3.80469 5.55999C3.80469 6.50676 4.5722 7.27427 5.51897 7.27427Z"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M5.51897 14.1315C6.46575 14.1315 7.23326 13.3639 7.23326 12.4172C7.23326 11.4704 6.46575 10.7029 5.51897 10.7029C4.5722 10.7029 3.80469 11.4704 3.80469 12.4172C3.80469 13.3639 4.5722 14.1315 5.51897 14.1315Z"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M5.51897 20.9886C6.46575 20.9886 7.23326 20.2211 7.23326 19.2743C7.23326 18.3276 6.46575 17.5601 5.51897 17.5601C4.5722 17.5601 3.80469 18.3276 3.80469 19.2743C3.80469 20.2211 4.5722 20.9886 5.51897 20.9886Z"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M10.6602 5.56006L20.9459 5.56006"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M10.6602 12.4172L20.9459 12.4172"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M10.6602 19.2744L20.9459 19.2744"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                </svg>
                <span className="admin-menu-label">게시글관리</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/orders"
                className="admin-menu-item"
                activeclassname="active"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.0882 12.2171C18.2716 12.2171 19.231 11.2577 19.231 10.0743C19.231 8.89079 18.2716 7.9314 17.0882 7.9314C15.9047 7.9314 14.9453 8.89079 14.9453 10.0743C14.9453 11.2577 15.9047 12.2171 17.0882 12.2171Z"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M10.2327 7.07429C11.4162 7.07429 12.3756 6.1149 12.3756 4.93143C12.3756 3.74796 11.4162 2.78857 10.2327 2.78857C9.04923 2.78857 8.08984 3.74796 8.08984 4.93143C8.08984 6.1149 9.04923 7.07429 10.2327 7.07429Z"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M13.639 15.6456H18.3739C20.7885 15.6456 20.9453 17.3599 20.9453 17.3599L10.861 21.2385C10.1865 21.4982 9.43388 21.4613 8.7876 21.1382L2.94531 18.217L2.94531 12.217H3.80246C4.7496 12.217 7.15046 12.5925 8.08817 13.9313H10.6596C12.553 13.9313 14.0882 15.4665 14.0882 17.3599L8.08817 17.3599"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                  />
                </svg>
                <span className="admin-menu-label">결제관리</span>
              </NavLink>
            </li>
            <li>
              <Button
                className="admin-menu-item admin-logout-button"
                onClick={handleLogout}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5195 10.3027L20.9481 10.3027"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M17.5195 6.87427L20.9481 10.3028L17.5195 13.7314"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                    strokeLinecap="square"
                  />
                  <path
                    d="M13.231 12.8743V16.3028H8.94531"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M2.94531 3.44556L8.94531 7.74498L8.94531 20.5884L2.94531 16.3027L2.94531 3.44556ZM2.94531 3.44556L13.231 3.44556L13.231 7.73127"
                    stroke="#DEE1E6"
                    strokeWidth="2.05714"
                    strokeMiterlimit="10"
                  />
                </svg>
                <span className="admin-menu-label">로그아웃</span>
              </Button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};
