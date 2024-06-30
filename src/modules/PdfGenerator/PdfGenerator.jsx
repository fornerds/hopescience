import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "../../components/Button";
import "./PdfGenerator.css";
import downloadIcon from "../../icons/move-layer-down.svg";
import pdfIndexIcon01 from "../../icons/container-156.svg";
import pdfIndexIcon02 from "../../icons/container-157.svg";
import stampImage from "../../images/stamp.png";
import { certificate } from "../../store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const generateAndDownloadPDF = async (certificate_id) => {
  const input = document.getElementById(`certificate-${certificate_id}`);
  const pdfDPI = 300;
  const scale = pdfDPI / 96;
  const canvas = await html2canvas(input, {
    scale: scale,
    useCORS: true,
    scrollX: 0,
    scrollY: -window.scrollY,
    windowWidth: input.scrollWidth,
    windowHeight: input.scrollHeight,
  });

  const pdfWidth = (210 * pdfDPI) / 25.4;
  const pdfHeight = (297 * pdfDPI) / 25.4;

  const pdf = new jsPDF({
    orientation: "p",
    unit: "pt",
    format: [pdfWidth, pdfHeight],
  });

  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

  pdf.save("이수증서.pdf");
};

const receiptPDF = async (payment_id) => {
  const input = document.getElementById(`order-receipt-${payment_id}`);
  const canvas = await html2canvas(input, {
    scale: 1,
    useCORS: true,
  });

  const pdfWidth = 595.28;
  const pdfHeight = 841.89;

  const canvasRatio = canvas.height / canvas.width;
  const pdfRatio = pdfHeight / pdfWidth;
  let ratio = 1;
  if (canvasRatio > pdfRatio) {
    ratio = pdfHeight / canvas.height;
  } else {
    ratio = pdfWidth / canvas.width;
  }

  const pdf = new jsPDF({
    orientation: "p",
    unit: "pt",
    format: [pdfWidth, pdfHeight],
  });

  const imgWidth = canvas.width * ratio;
  const imgHeight = canvas.height * ratio;

  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  pdf.save("영수증.pdf");
};

export const PdfGenerator = () => {
  let {certificate_id} = useParams();

  const {getCertificate, certificate:certificateData, clearCertificate} = certificate((state=>({getCertificate: state.getCertificate, certificate: state.certificate, clearCertificate: state.clearCertificate})))

  useEffect(()=>{
    clearCertificate();
    getCertificate(certificate_id);
  },[])

  function formatISOToKoreanDate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더합니다.
    const day = date.getDate();
  
    return `${year}년 ${month.toString().padStart(2, '0')}월 ${day.toString().padStart(2, '0')}일`;
  }

  return (
    <div className="pdf-generator">
      <Button
        label="저장하기"
        onClick={() => generateAndDownloadPDF(certificate_id)}
        style={{ alignSelf: "end", marginTop: "20px" }}
      >
        <img
          className="move-layer-down"
          alt="저장하기"
          src={downloadIcon}
        />
      </Button>

      <div className="certificate" id={`certificate-${certificate_id}`}>
        <div className="certificate-pdf-content">
          <p className="certificate-pdf-id">발급번호: {certificateData?.certificate_id}</p>
          <h1 className="certificate-pdf-title">수 료 증 서</h1>
          <h2 className="certificate-pdf-title-eng">
            Certificate of completion
          </h2>
          <div className="certificate-pdf-data">
            <div className="certificate-pdf-data-index">성 명:</div>
            <div>{certificateData?.user_name}</div>
          </div>
          <div className="certificate-pdf-data">
            <div className="certificate-pdf-data-index">교 육 과 정:</div>
            <div>{certificateData?.course_name}</div>
          </div>
          <div className="certificate-pdf-data">
            <div className="certificate-pdf-data-index">수 료 일:</div>
            <div>{formatISOToKoreanDate(certificateData?.completion_date)}</div>
          </div>
          <div className="certificate-pdf-desc">
            &nbsp;&nbsp;&nbsp;상기 사람은 본 센터에서 실시한 위 소정의 교육과정
            전 과목을 성실히 이수하고 해당 교과 시험을 합격하여 성료하였으므로
            본 증서를 정히 수여합니다.
          </div>
        </div>
        <div className="certificate-pdf-company">
          <div className="certificate-pdf-company-name">
            희망과학심리상담센터장 이 현 호
          </div>
          <img
            src={stampImage}
            alt="희망과학심리센터장 도장"
            width="100px"
            height="100px"
          />
        </div>
      </div>
    </div>
  );
};

export const ReceiptPdfGenerator = () => {
  const payment_id = 3;
  return (
    <>
      <div className="order-title-wrap">
        <h2 className="order-title">결제상세</h2>
        <div className="order-buttons">
          <Button
            label="영수증 저장하기"
            onClick={() => receiptPDF(payment_id)}
            style={{
              height: "36px",
              padding: "auto 16px",
              fontSize: "14px",
            }}
          >
            <img
              className="move-layer-down"
              alt="저장하기"
              src={downloadIcon}
            />
          </Button>
          <Button
            label="결제 취소하기"
            style={{ height: "36px", padding: "auto 16px", fontSize: "14px" }}
          ></Button>
        </div>
      </div>
      <div className="order-receipt-wrap">
        <div className="order-receipt" id={`order-receipt-${payment_id}`}>
          <div className="order-receipt-info">
            <div className="order-receipt-index-wrap">
              <img src={pdfIndexIcon01} alt="결제 방법" />
              <h4 className="order-receipt-index">결제 정보</h4>
            </div>
            <table className="order-receipt-info-table">
              <tbody>
                <tr>
                  <td>결제금액</td>
                  <td>40,000</td>
                </tr>
                <tr>
                  <td>부가세</td>
                  <td>4,000</td>
                </tr>
                <tr>
                  <td>할인액</td>
                  <td>-0</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td className="order-receipt-info-value-strong">44,000</td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td>결제일</td>
                  <td>2024-01-19 05:35 PM</td>
                </tr>
                <tr>
                  <td>구매자</td>
                  <td>Elizabeth Allen</td>
                </tr>
                <tr>
                  <td>결제번호</td>
                  <td>#996</td>
                </tr>
                <tr>
                  <td>할부</td>
                  <td>10개월</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="order-receipt-pay-by">
            <div className="order-receipt-index-wrap">
              <img src={pdfIndexIcon02} alt="결제 방법" />
              <h4 className="order-receipt-index">결제 방법</h4>
            </div>
            <table className="order-receipt-pay-by-table">
              <tbody>
                <tr>
                  <td>삼성카드</td>
                  <td>0000-****-****-1234</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export const AdminReceiptPdfGenerator = () => {
  const getStateClassName = (state) => {
    const stateClassMap = {
      결제취소: "cancel",
      결제중: "paying",
      결제완료: "paid",
    };
    return stateClassMap[state] || "";
  };

  const payment_id = 3;
  return (
    <>
      <div className="admin-order-title-wrap">
        <div className="admin-order-price-state">
          <h2 className="admin-order-title">44,000원</h2>
          <div
            className={`admin-order-item-state ${getStateClassName(
              "결제완료"
            )}`}
          >
            결제완료
          </div>
        </div>
        <div className="admin-order-buttons">
          <Button
            label="영수증 보내기"
            onClick={() => receiptPDF(payment_id)}
            style={{
              height: "36px",
              padding: "auto 16px",
              fontSize: "14px",
            }}
          ></Button>
          <Button
            label="환불 하기"
            style={{ height: "36px", padding: "auto 16px", fontSize: "14px" }}
          ></Button>
        </div>
      </div>
      <div className="admin-order-receipt-wrap">
        <div
          className="admin-order-receipt"
          id={`admin-order-receipt-${payment_id}`}
        >
          <div className="admin-order-receipt-info">
            <div className="admin-order-receipt-index-wrap">
              <img src={pdfIndexIcon01} alt="결제 방법" />
              <h4 className="admin-order-receipt-index">결제 정보</h4>
            </div>
            <table className="admin-order-receipt-info-table">
              <tbody>
                <tr>
                  <td>결제금액</td>
                  <td>40,000</td>
                </tr>
                <tr>
                  <td>부가세</td>
                  <td>4,000</td>
                </tr>
                <tr>
                  <td>할인액</td>
                  <td>-0</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td className="admin-order-receipt-info-value-strong">
                    44,000
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td>결제일</td>
                  <td>2024-01-19 05:35 PM</td>
                </tr>
                <tr>
                  <td>구매자</td>
                  <td>Elizabeth Allen</td>
                </tr>
                <tr>
                  <td>결제번호</td>
                  <td>#996</td>
                </tr>
                <tr>
                  <td>할부</td>
                  <td>10개월</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="admin-order-receipt-pay-by">
            <div className="admin-order-receipt-index-wrap">
              <img src={pdfIndexIcon02} alt="결제 방법" />
              <h4 className="admin-order-receipt-index">결제 방법</h4>
            </div>
            <table className="admin-order-receipt-pay-by-table">
              <tbody>
                <tr>
                  <td>삼성카드</td>
                  <td>0000-****-****-1234</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
