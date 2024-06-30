import { useEffect, useMemo } from "react";
import { Link } from "../../components/Link";
import "./CertificateTable.css";
import { certificate } from "../../store"

export const CertificateTable = () => {
    const {getCertificatesByUser, certificates, clearCertificates, isLoading} = certificate((state => ({getCertificatesByUser: state.getCertificatesByUser, certificates: state.certificates, clearCertificates: state.clearCertificates, isLoading: state.isLoading})));

  const myUserId = useMemo(() => {
    const data = sessionStorage.getItem("auth-storage");
    return data ? JSON.parse(data).state?.user?.userId : null;
  }, []);

  useEffect(()=>{
    clearCertificates();
    getCertificatesByUser(myUserId);
  },[])

  return (
    <div className="certificate-table-container">
      <div className="certificate-table">
        <div className="certificate-table-header">
          <div className="certificate-table-mobile-hide">발급번호</div>
          <div className="certificate-table-title">강의명</div>
          <div className="certificate-table-mobile-hide">수강완료일</div>
          <div>이수증서발급</div>
        </div>
        <ol className="certificate-table-list">
          {
          isLoading? (
            <li className="certificate-table-loading-item">
              사용자의 이수증서 정보를 가져오고 있습니다...
            </li>
          ):
          certificates ?
          certificates.map((certificate) => (
            <li className="certificate-table-item" key={certificate.id}>
              <div className="certificate-table-mobile-hide">{certificate.certificate_id}</div>
              <h3>{certificate.course_name}</h3>
              <div className="certificate-table-mobile-hide">{new Date(certificate.completion_date).toLocaleDateString("ko-KR")}</div>
              <Link
                to={`/mypage/certificates/${certificate.certificate_id}`}
                label="발급하기"
                style={{ fontSize: "14px", width: "100px", height: "40px" }}
                buttonStyle="default"
                color="white"
              />
            </li>
          ))
          :
          <li className="certificate-table-item">
            <div className="certificate-table-item-title-wrap">
              <h3>아직 모든 강의를 수강한 서비스가 존재하지 않습니다.</h3>
            </div>
          </li>
        }
        </ol>
      </div>
    </div>
  );
};
