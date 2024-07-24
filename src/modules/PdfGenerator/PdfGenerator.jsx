import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "../../components/Button";
import "./PdfGenerator.css";
import downloadIcon from "../../icons/move-layer-down.svg";
import pdfIndexIcon01 from "../../icons/container-156.svg";
import pdfIndexIcon02 from "../../icons/container-157.svg";
import { payment, enrollment } from "../../store";
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

  const {getCertificate, certificate:certificateData, clearCertificate, updateCertificate} = certificate((state=>({getCertificate: state.getCertificate, certificate: state.certificate, clearCertificate: state.clearCertificate, updateCertificate: state.updateCertificate})))

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

  const handleGenerateAndDownload = async () => {
    await generateAndDownloadPDF(certificate_id);
    
    if (certificateData && certificateData.user_name && certificateData.completion_date && !certificateData.is_issued) {
      const updateData = {
        user_name: certificateData.user_name,
        completion_date: certificateData.completion_date,
        is_issued: true
      };
      
      try {
        await updateCertificate(certificate_id, updateData);
      } catch (error) {
        console.error("함수 발행 여부 변경이 실패했습니다:", error);
      }
    }
  };

  return (
    <div className="pdf-generator">
      <Button
        label="저장하기"
        onClick={handleGenerateAndDownload}
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
  const { order_id } = useParams();
  const getPaymentByOrderId = payment((state) => state.getPaymentByOrderId);
  const paymentData = payment((state) => state.payment);
  const isLoading = payment((state) => state.isLoading);
  // const cancelPayment = payment((state) => state.cancelPayment);
  // const deleteEnrollment = enrollment((state) => state.deleteEnrollment)
  // const getIsEnrolled = enrollment((state)=> state.getIsEnrolled)
  // const enrollmentData = enrollment((state)=> state.enrollment)

  useEffect(() => {
    const fetchPayment = async () => {
      await getPaymentByOrderId(order_id);
    };
    fetchPayment();
  }, [getPaymentByOrderId, order_id]);

  // const handleCancel = async () => {
  //   const paymentKey = paymentData?.payment_key;
  //   const purchaserUserId = paymentData?.user_id;
  //   const purchaserCourseId = paymentData?.course_id;
  
  //   if (paymentKey) {
  //     const confirmCancel = window.confirm("정말로 결제를 취소하시겠습니까?");
  //     if (confirmCancel) {
  //       try {
  //         // 결제 취소
  //         await cancelPayment(paymentKey, "관리자에 의한 결제 취소", paymentData?.amount);
          
  //         // 등록 정보 확인
  //         const enrollmentInfo = await getIsEnrolled(purchaserUserId, purchaserCourseId);
          
  //         if (enrollmentInfo && enrollmentInfo.id) {
  //           // 등록 삭제
  //           await deleteEnrollment(enrollmentInfo.id);
  //           alert("결제가 취소되고 수강 등록이 삭제되었습니다.");
  //         } else {
  //           alert("결제는 취소되었지만, 수강 등록 정보를 찾을 수 없습니다.");
  //         }
  //       } catch (error) {
  //         console.error("Error during cancellation process:", error);
  //         if (error.response && error.response.status === 404) {
  //           alert("결제 정보를 찾을 수 없습니다.");
  //         } else if (error.message === "ALREADY_CANCELED_PAYMENT") {
  //           alert("이미 취소된 결제입니다.");
  //         } else {
  //           alert("결제 취소 중 오류가 발생했습니다. 관리자에게 문의해주세요.");
  //         }
  //       }
  //     }
  //   } else {
  //     alert("결제 키 정보가 없습니다. 관리자에게 문의해주세요.");
  //   }
  // };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="order-title-wrap">
        <h2 className="order-title">결제상세</h2>
        <div className="order-buttons">
          <Button
            label="영수증 저장하기"
            onClick={() => receiptPDF(order_id)}
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
          {/* <Button
            label="결제 취소하기"
            style={{ height: "36px", padding: "auto 16px", fontSize: "14px" }}
            onClick={handleCancel}
          ></Button> */}
        </div>
      </div>
      <div className="order-receipt-wrap">
        <div className="order-receipt" id={`order-receipt-${order_id}`}>
          <div className="order-receipt-info">
            <div className="order-receipt-index-wrap">
              <img src={pdfIndexIcon01} alt="결제 방법" />
              <h4 className="order-receipt-index">결제 정보</h4>
            </div>
            <table className="order-receipt-info-table">
              <tbody>
                <tr>
                  <td>결제금액</td>
                  <td>{paymentData?.amount}</td>
                </tr>
                <tr>
                  <td>부가세</td>
                  <td>{(paymentData?.amount * 0.1).toFixed(0)}</td>
                </tr>
                <tr>
                  <td>할인액</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td className="order-receipt-info-value-strong">
                    {paymentData?.amount}
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td>결제일</td>
                  <td>{new Date(paymentData?.created_at).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>구매자</td>
                  <td>{paymentData?.user_name}</td>
                </tr>
                <tr>
                  <td>결제번호</td>
                  <td>#{paymentData?.payment_id}</td>
                </tr>
                <tr>
                  <td>할부</td>
                  <td>일시불</td>
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
                  <td>카드사</td>
                  <td>0000-****-****-0000</td>
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
  const { order_id } = useParams();
  const getPaymentByOrderId = payment((state) => state.getPaymentByOrderId);
  const paymentData = payment((state) => state.payment);
  const isLoading = payment((state) => state.isLoading);
  const cancelPayment = payment((state) => state.cancelPayment);
  const deleteEnrollment = enrollment((state) => state.deleteEnrollment)
  const getIsEnrolled = enrollment((state)=> state.getIsEnrolled)

  useEffect(() => {
    const fetchPayment = async () => {
      if (order_id) {
        await getPaymentByOrderId(order_id);
      }
    };
    fetchPayment();
  }, [getPaymentByOrderId, order_id]);

  const handleCancel = async () => {
    const paymentKey = paymentData?.payment_key;
    const purchaserUserId = paymentData?.user_id;
    const purchaserCourseId = paymentData?.course_id;
  
    if (paymentKey) {
      const confirmCancel = window.confirm("정말로 결제를 취소하시겠습니까?");
      if (confirmCancel) {
        try {
          // 결제 취소
          await cancelPayment(paymentKey, "관리자에 의한 결제 취소", paymentData?.amount);
          
          // 등록 정보 확인
          const enrollmentInfo = await getIsEnrolled(purchaserUserId, purchaserCourseId);
          
          if (enrollmentInfo && enrollmentInfo.id) {
            // 등록 삭제
            await deleteEnrollment(enrollmentInfo.id);
            alert("결제가 취소되고 수강 등록이 삭제되었습니다.");
          } else {
            alert("결제는 취소되었지만, 수강 등록 정보를 찾을 수 없습니다.");
          }
        } catch (error) {
          console.error("Error during cancellation process:", error);
          if (error.response && error.response.status === 404) {
            alert("결제 정보를 찾을 수 없습니다.");
          } else if (error.message === "ALREADY_CANCELED_PAYMENT") {
            alert("이미 취소된 결제입니다.");
          } else {
            alert("결제 취소 중 오류가 발생했습니다. 관리자에게 문의해주세요.");
          }
        }
      }
    } else {
      alert("결제 키 정보가 없습니다. 관리자에게 문의해주세요.");
    }
  };

  const getStateClassName = (state) => {
    const stateClassMap = {
      결제취소: "canceled",
      결제중: "paying",
      결제완료: "paid",
    };
    return stateClassMap[state] || "";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="admin-order-title-wrap">
        <div className="admin-order-price-state">
          <h2 className="admin-order-title">{paymentData?.amount}원</h2>
          <div
            className={`admin-order-item-state ${getStateClassName(
              paymentData?.status
            )}`}
          >
            {paymentData?.status}
          </div>
        </div>
        <div className="admin-order-buttons">
          <Button
            label="영수증 보내기"
            onClick={() => receiptPDF(order_id)}
            style={{
              height: "36px",
              padding: "auto 16px",
              fontSize: "14px",
            }}
          ></Button>
          <Button
            label="환불 하기"
            style={{ height: "36px", padding: "auto 16px", fontSize: "14px" }}
            onClick={handleCancel}
          ></Button>
        </div>
      </div>
      <div className="admin-order-receipt-wrap">
        <div
          className="admin-order-receipt"
          id={`admin-order-receipt-${order_id}`}
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
                  <td>{paymentData?.amount}</td>
                </tr>
                <tr>
                  <td>부가세</td>
                  <td>{(paymentData?.amount * 0.1).toFixed(0)}</td>
                </tr>
                <tr>
                  <td>할인액</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td className="admin-order-receipt-info-value-strong">
                    {paymentData?.amount}
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td>결제일</td>
                  <td>{new Date(paymentData?.created_at).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>구매자</td>
                  <td>{paymentData?.user_name}</td>
                </tr>
                <tr>
                  <td>결제번호</td>
                  <td>#{paymentData?.payment_id}</td>
                </tr>
                <tr>
                  <td>할부</td>
                  <td>일시불</td>
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
                  <td>카드사</td>
                  <td>0000-****-****-0000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};