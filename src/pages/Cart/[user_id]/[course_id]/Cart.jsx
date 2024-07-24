import "./Cart.css";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { Header, Footer, Button, Input } from "../../../../components";
import { Modal } from "../../../../modules/Modal";
import { payment, user, service } from "../../../../store";
import mainImage from "../../../../images/main.png";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const widgetClientKey = process.env.REACT_APP_TOSS_PAYMENTS_CLIENT_KEY;

const editUserSchema = yup
  .object({
    name: yup.string().required("이름을 입력해주세요.").matches(
      /^[가-힣]{2,}$|^[a-zA-Z]{2,}$/,
      "유효한 이름형식으로 입력해주세요"
    )
    .test(
      'no-consonant-vowel-only',
      '자음이나 모음만으로 이루어진 이름은 허용되지 않습니다.',
      function(value) {
        if (typeof value !== 'string') return true;
        return !/^[ㄱ-ㅎㅏ-ㅣ]+$/.test(value);
      }
    ),

    phone: yup
      .string()
      .required("연락처를 입력해주세요.")
      .matches(
        /^\d{3}-\d{3,4}-\d{4}$/,
        "유효한 연락처를 입력해주세요. 예 010-0000-0000"
      ),
    email: yup
      .string()
      .required("이메일 주소를 입력해주세요.")
      .email("유효한 이메일 주소를 입력해주세요."),
  })
  .required();

export const Cart = () => {
  const [paymentWidget, setPaymentWidget] = useState(null);
  const [customerKey, setCustomerKey] = useState(null);
  const [orderNumber, setOrderNumber] = useState('');
  const paymentMethodsWidgetRef = useRef(null);
  const [price, setPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const createPayment = payment((state) => state.createPayment);
  const userData = user((state) => state.profile);
  const getUser = user((state) => state.getUser);
  const isUserLoading = user((state) => state.isLoading);
  const data = sessionStorage.getItem("auth-storage");
  const navigate = useNavigate();
  let { course_id } = useParams();
  const isServiceLoading = service((state) => state.isLoading);
  const getService = service((state) => state.getService);
  const course = service((state) => state.course) || null;
  const myUserId = data ? JSON.parse(data).state?.user?.userId : null;
  const [isPopupBlockedModalOpen, setIsPopupBlockedModalOpen] = useState(false);
  const orderNumberGenerated = useRef(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [editedUserData, setEditedUserData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const updateUser = user((state) => state.updateUser);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(editUserSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: ''
    }
  });

  const removeHyphensFromPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/-/g, '');
  };

  const generateOrderNumber = (courseId) => {
    const today = new Date();
    const yy = String(today.getFullYear()).slice(2);
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yy}${mm}${dd}`;

    const courseIdStr = String(courseId).padStart(3, '0');
    const randomNum = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    
    return `${dateStr}${courseIdStr}${randomNum}`;
  };

  useEffect(() => {
    if (!orderNumberGenerated.current && course_id) {
      const newOrderNumber = generateOrderNumber(course_id);
      setOrderNumber(newOrderNumber);
      orderNumberGenerated.current = true;
    }
  }, [course_id]);

  useEffect(() => {
    getService(course_id);
  }, [course_id, getService]);

  useEffect(()=> {
    if(!myUserId){
      alert("로그인 후 결제가 가능합니다")
      navigate("/signin")
    } else if(!userData){
      getUser(myUserId);
    }
    setCustomerKey(userData?.uuid)
  }, [data, userData, myUserId, getUser, navigate]);

  useEffect(() => {
    const fetchPaymentWidget = async () => {
      try {
        const loadedWidget = await loadPaymentWidget(
          widgetClientKey,
          customerKey
        );
        setPaymentWidget(loadedWidget);
      } catch (error) {
        console.error("Error requesting payment:", error);
      }
    };

    if (customerKey) {
      fetchPaymentWidget();
    }
  }, [customerKey]);

  useEffect(() => {
    if (paymentWidget && price > 0) {
      const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
        "#payment-widget",
        { value: price },
        { variantKey: "DEFAULT" }
      );

      paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

      paymentMethodsWidgetRef.current = paymentMethodsWidget;
    }
  }, [paymentWidget, price]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget && price > 0) {
      paymentMethodsWidget.updateAmount(price);
    }
  }, [price]);

  useEffect(() => {
    if (course?.discounted_price) {
      setPrice(Number(course.discounted_price));
    }
  }, [course]);

  const handlePaymentRequest = async (orderId, serviceName, name, email, phone, amount, userId, courseId) => {
    try {
      if (!course?.category?.name) {
        throw new Error("카테고리 정보가 없습니다. 관리자에게 문의해주세요.");
      }

      // 팝업 차단 여부 확인
      const popupWindow = window.open('about:blank', 'TossPayments');
      if (!popupWindow || popupWindow.closed || typeof popupWindow.closed === 'undefined') {
        // 팝업이 차단된 경우
        popupWindow?.close(); // 빈 팝업 창을 닫습니다.
        setIsPopupBlockedModalOpen(true);
        return; // 여기서 함수 실행을 종료합니다.
      }
      popupWindow.close(); // 테스트용 팝업 창을 닫습니다.
  
      const success = await createPayment(
        orderId, 
        amount, 
        Number(userId), 
        Number(courseId), 
        serviceName, 
        course.category.name
      );
      
      if (success) {
        try{
          await paymentWidget?.requestPayment({
            orderId: orderId,
            orderName: serviceName,
            customerName: name,
            customerEmail: email,
            customerMobilePhone: removeHyphensFromPhoneNumber(phone),
            successUrl: `${process.env.REACT_APP_CLIENT_URL}/cart/${userId}/${courseId}/success`,
            failUrl: `${process.env.REACT_APP_CLIENT_URL}/cart/${userId}/${courseId}/fail`,
          });
        } catch (error) {
          let errorMessage = "결제 중 오류가 발생했습니다.";
          switch (error.code) {
            case "AGREEMENT_WIDGET_ALREADY_RENDERED":
              errorMessage = "하나의 약관 위젯만을 사용할 수 있어요.";
              break;
            case "BELOW_ZERO_AMOUNT":
              errorMessage = "금액은 0보다 커야 합니다.";
              break;
            case "CUSTOM_PAYMENT_METHOD_UNABLE_TO_PAY":
              errorMessage = "커스텀 결제수단으로 결제할 수 없습니다.";
              break;
            case "EXCEED_DEPOSIT_AMOUNT_LIMIT":
              errorMessage = "가상계좌 입금 제한 금액을 초과했어요. 다른 결제수단을 이용해주세요.";
              break;
            case "EXCEED_MAX_DUE_DATE":
              errorMessage = "가상 계좌의 최대 유효만료 기간을 초과했습니다.";
              break;
            case "INCORRECT_FAIL_URL_FORMAT":
              errorMessage = "잘못된 failUrl 입니다.";
              break;
            case "INCORRECT_SUCCESS_URL_FORMAT":
              errorMessage = "잘못된 successUrl 입니다.";
              break;
            case "INVALID_AMOUNT_CURRENCY":
              errorMessage = "잘못된 통화 값입니다.";
              break;
            case "INVALID_AMOUNT_VALUE":
              errorMessage = "결제금액이 올바르지 않습니다.";
              break;
            case "INVALID_PARAMETER":
              errorMessage = "파라미터가 올바르지 않습니다.";
              break;
            case "INVALID_CLIENT_KEY":
              errorMessage = "ClientKey 형태가 올바르지 않습니다.";
              break;
            case "INVALID_CUSTOMER_KEY":
              errorMessage = "고객키 형식이 올바르지 않습니다.";
              break;
            case "INVALID_METHOD_TRANSACTION":
              errorMessage = "이미 다른 요청을 수행하고 있어요.";
              break;
            case "INVALID_PARAMETERS":
              errorMessage = "필수 파라미터를 누락하거나, 정의되지 않은 파라미터를 추가하거나, 파라미터의 타입이 올바르지 않습니다.";
              break;
            case "INVALID_SELECTOR":
              errorMessage = "selector에 해당하는 HTML 요소를 찾을 수 없습니다. selector 값을 다시 확인해주세요.";
              break;
            case "INVALID_VARIANT_KEY":
              errorMessage = "variantKey 에 해당하는 위젯을 찾을 수 없습니다. variantKey 값을 다시 확인해주세요.";
              break;
            case "NEED_AGREEMENT_WITH_REQUIRED_TERMS":
              errorMessage = "필수 약관에 동의해주세요.";
              break;
            case "NEED_CARD_PAYMENT_DETAIL":
              errorMessage = "카드 결제 정보를 선택해주세요.";
              break;
            case "NEED_REFUND_ACCOUNT_DETAIL":
              errorMessage = "환불계좌 정보를 모두 입력해주세요.";
              break;
            case "NOT_SELECTED_PAYMENT_METHOD":
              errorMessage = "결제수단이 아직 선택되지 않았어요. 결제수단을 선택해 주세요.";
              break;
            case "NOT_SETUP_AMOUNT":
              errorMessage = "결제금액이 설정되지 않았습니다. setAmount를 호출해주세요.";
              break;
            case "NOT_SUPPORTED_PROMISE":
              errorMessage = "Promise 방식을 지원하지 않습니다. successUrl, failUrl을 사용해주세요.";
              break;
            case "PAYMENT_METHODS_WIDGET_ALREADY_RENDERED":
              errorMessage = "하나의 결제수단 위젯만을 사용할 수 있어요.";
              break;
            case "PROVIDER_STATUS_UNHEALTHY":
              errorMessage = "결제 기관(카드사, 은행, 국세청 등) 오류입니다. 다른 결제수단을 선택해 주세요.";
              break;
            case "UNSUPPORTED_TEST_PHASE_PAYMENT_METHOD":
              errorMessage = "테스트 환경을 지원하지 않는 결제수단입니다.";
              break;
            case "USER_CANCEL":
              errorMessage = "취소되었습니다.";
              break;
            case "V1_METHOD_NOT_SUPPORTED":
              errorMessage = "해당 API 는 v1 에서만 제공됩니다.";
              break;
            case "WIDGETS_SDK_INITIALIZE_CONFLICT":
              errorMessage = "widgets는 payment 또는 brandpay와 같이 사용할 수 없습니다.";
              break;
            case "UNKNOWN":
            default:
              errorMessage = "알 수 없는 에러가 발생했습니다.";
          }
          setErrorMessage(errorMessage);
          setIsModalOpen(true);
        } 
      }else {
        setErrorMessage("결제 생성에 실패했습니다.");
        setIsModalOpen(true);
      }
    } catch (error) {
      setErrorMessage(`결제 오류 ${error}`);
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    if (userData) {
      setValue('name', userData.name);
      setValue('phone', userData.phone);
      setValue('email', userData.email);
    }
  }, [userData, setValue]);


  const handleEditUser = async (data) => {
    console.log(data.email, data.name, data.phone);
    try {
      await updateUser(myUserId, userData.uuid, data.email, data.name, data.phone);
      setIsEditModalOpen(false);
      getUser(myUserId); // 수정된 정보를 다시 불러옵니다.
    } catch (error) {
      console.error("Failed to update user:", error);
      setErrorMessage("회원 정보 수정에 실패했습니다.");
      setIsModalOpen(true);
    }
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength <= 3) return phoneNumber;
    if (phoneNumberLength <= 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  const handlePhoneChange = (e, onChange) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    onChange(formattedValue);
  };

  const renderEditUserModal = () => (
    <Modal
      modalTitle="회원 정보 수정"
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      onConfirm={handleSubmit(handleEditUser)}
      confirmLabel="수정하기"
      cancelLabel="취소"
    >
      <form className="edit-user-form">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div className="edit-user-input">
              <label htmlFor="name">이름</label>
              <Input {...field} type="text" placeholder="이름을 입력하세요" />
              {errors.name && <p className="input-error-message">{errors.name.message}</p>}
            </div>
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="edit-user-input">
              <label htmlFor="phone">연락처</label>
              <Input
                type="tel"
                placeholder="연락처를 입력하세요"
                value={value}
                onChange={(e) => handlePhoneChange(e, onChange)}
              />
              {errors.phone && <p className="input-error-message">{errors.phone.message}</p>}
            </div>
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div className="edit-user-input">
              <label htmlFor="email">이메일</label>
              <Input {...field} type="email" placeholder="이메일 주소를 입력하세요" />
              {errors.email && <p className="input-error-message">{errors.email.message}</p>}
            </div>
          )}
        />
      </form>
    </Modal>
  );

  const renderPopupBlockedModal = () => (
    <Modal
      modalTitle="팝업 차단 알림"
      isOpen={isPopupBlockedModalOpen}
      onClose={() => setIsPopupBlockedModalOpen(false)}
      cancelLabel="확인"
    >
      <div className="popup-blocked-modal">
        <p>팝업 차단이 활성화되어 있어 결제 창을 열 수 없습니다. 팝업 차단을 해제한 후 다시 시도해 주세요.</p>
        <ol className="popup-blocked-modal-list">
          <li>1. 브라우저 설정에서 팝업 차단 해제</li>
          <li>2. 현재 사이트에 대해 팝업 허용</li>
          <li>3. 페이지를 새로고침한 후 다시 시도</li>
        </ol>
      </div>
    </Modal>
  );

  return (
    <>
      <Header />
      <main className="cart-background">
        <div className="cart-info-wrap">
          {isServiceLoading ? 
            <section className="cart-info-course">
              <h3 className="cart-label">주문상품 정보</h3>
              <div className="cart-info-course-content-wrap">
                <div className="cart-course-image-wrap">
                  <div className="course-image-skeleton">
                  </div>
                </div>
                <div className="cart-info-course-content">
                  <div className="cart-info-payment-number-wrap">
                    <p className="cart-info-payment-number-label">주문번호</p>
                    <p className="course-order-id-skeleton"></p>
                  </div>
                  <p className="cart-info-course-label">상품명:</p>
                  <div className="cart-info-course-wrap">
                    <p className="course-title-skeleton"></p>
                    <p className="course-price-skeleton"></p>
                  </div>
                </div>
              </div>
            </section>
          :
          <section className="cart-info-course">
            <h3 className="cart-label">주문상품 정보</h3>
            <div className="cart-info-course-content-wrap">
              <div className="cart-course-image-wrap">
                <img
                  className="cart-course-image"
                  src={course?.thumbnail ? course?.thumbnail : mainImage}
                  alt="강의 썸네일"
                />
              </div>
              <div className="cart-info-course-content">
                <div className="cart-info-payment-number-wrap">
                  <p className="cart-info-payment-number-label">주문번호</p>
                  <p className="cart-info-payment-number">{orderNumber}</p>
                </div>
                <p className="cart-info-course-label">상품명:</p>
                <div className="cart-info-course-wrap">
                  <p>{course?.title}</p>
                  <p>{course?.discounted_price.toLocaleString()}원</p>
                </div>
              </div>
            </div>
          </section>
          }
          <section className="cart-info-user">
            <div className="cart-info-label-wrap">
              <h3 className="cart-label">주문자 정보</h3>
              <Button
                label="수정"
                style={{
                  width: "52px",
                  height: "36px",
                  backgroundColor: "#171A1F",
                  fontSize: "14px",
                }}
                onClick={() => setIsEditModalOpen(true)}
              />
            </div>
            {isUserLoading ? (
              <>
                <div className="cart-info-user-content">
                  <p className="cart-info-user-label">이름:</p>
                  <div className="course-user-name-skeleton"></div>
                </div>
                <div className="course-user-tel-skeleton"></div>
                <div className="course-user-email-skeleton"></div>
              </>
            ) : (
              <>
                <div className="cart-info-user-content">
                  <p className="cart-info-user-label">이름:</p>
                  <div className="cart-info-user-wrap">{userData?.name}</div>
                </div>
                <div className="cart-info-user-tel">{userData?.phone}</div>
                <div className="cart-info-user-email">{userData?.email}</div>
              </>
            )}
          </section>
          <div id="payment-widget" />
          <div id="agreement" />
        </div>
        <div className="cart-receipt-wrap">
          <section className="cart-receipt">
          {isServiceLoading ? (
            <>
              <h3 className="cart-label">최종결제금액</h3>
              <div className="cart-receipt-price">
                <p>상품가격</p>
                <p className="course-cost-skeleton"></p>
              </div>
              <div className="cart-receipt-discount">
                <p>할인</p>
                <p className="course-discount-skeleton"></p>
              </div>
              <div className="cart-receipt-total-price">
                <p>총결제금액</p>
                <p className="course-total-price-skeleton"></p>
              </div>
            </>
          ) : (
            <>
              <h3 className="cart-label">최종결제금액</h3>
              <div className="cart-receipt-price">
                <p>상품가격</p>
                <p>{course?.price.toLocaleString()}원</p>
              </div>
              <div className="cart-receipt-discount">
                <p>할인</p>
                <p>- {(Number(course?.price) - Number(course?.discounted_price)).toLocaleString()}원</p>
              </div>
              <div className="cart-receipt-total-price">
                <p>총결제금액</p>
                <p>{course?.discounted_price.toLocaleString()}원</p>
              </div>
            </>
          )}
          </section>
          <Button
            label="결제하기"
            variant="primary"
            size="full"
            style={{ height: "52px" }}
            onClick={()=>handlePaymentRequest(orderNumber, course?.title, userData?.name, userData?.email, userData?.phone, Number(course?.discounted_price), userData?.id, course_id)}
          />
        </div>
        {renderEditUserModal()}
        {renderPopupBlockedModal()}
        <Modal
          modalTitle="결제오류"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cancelLabel="확인"
        >
          <p>{errorMessage}</p>
        </Modal>
      </main>
      <Footer />
    </>
  );
};
