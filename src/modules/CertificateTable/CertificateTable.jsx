import { Link } from "../../components/Link";
import "./CertificateTable.css";
import exampleImage from "../../images/example.png"
import opengraphImage from "../../images/opengraph.png"

export const CertificateTable = () => {
  const completedCourses = [
    {
      id: 2,
      title: "직장내 성희롱 예방교육",
      img: exampleImage,
      status: "수강완료",
      paymentDate: "2024-03-15",
      lastUpdated: "2024-03-05",
    },
    {
      id: 4,
      title: "중독범죄 예방 심리교육",
      img: opengraphImage,
      status: "수강완료",
      paymentDate: "2024-04-03",
      lastUpdated: "2024-03-15",
    },
  ];

  return (
    <div className="certificate-table-container">
      <div className="certificate-table">
        <div className="certificate-table-header">
          <div className="certificate-table-title">강의명</div>
          <div className="certificate-table-mobile-hide">결제일</div>
          <div className="certificate-table-mobile-hide">수강완료일</div>
          <div>이수증서발급</div>
        </div>
        <ol className="certificate-table-list">
          {completedCourses.map((certificate) => (
            <li className="certificate-table-item" key={certificate.id}>
              <div className="certificate-table-item-title-wrap">
                <div className="certificate-table-image-wrap">
                  <img
                    className="certificate-table-image"
                    src={certificate.img}
                    alt={certificate.title}
                  />
                </div>
                <h3>{certificate.title}</h3>
              </div>
              <div className="certificate-table-mobile-hide">{certificate.paymentDate}</div>
              <div className="certificate-table-mobile-hide">{certificate.lastUpdated}</div>
              <Link
                to={`/mypage/certificates/${certificate.id}`}
                label="발급하기"
                style={{ fontSize: "14px", width: "100px", height: "40px" }}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
