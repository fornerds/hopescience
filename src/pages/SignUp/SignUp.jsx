import React, { useState, useEffect, useRef, useCallback } from "react";
import { Header, Footer, Input, Button, Link } from "../../components";
import { Modal } from "../../modules/Modal";
import "./style.css";
import { auth } from "../../store";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LineLeft from "../../icons/line-left.svg";
import LineRight from "../../icons/line-right.svg";
import naverImage from "../../images/naver.png";
import { PolicyContent } from "../Policy/Policy";

const schema = yup
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
    password: yup
      .string()
      .required("비밀번호를 입력해주세요.")
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .matches(/[a-zA-Z]/, "비밀번호에는 문자가 포함되어야 합니다.")
      .matches(/[0-9]/, "비밀번호에는 숫자가 포함되어야 합니다."),
    terms: yup.bool().oneOf([true], "이용약관 및 정보보호정책에 동의해주세요."),
  })
  .required();

export const SignUp = () => {
  const signup = auth((state) => state.register);
  const isLoading = auth((state) => state.isLoading);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const naverLoginRef = useRef();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const { name, phone, email, password } = data;
      console.log(
        "name:",
        name,
        "phone: ",
        phone,
        "email: ",
        email,
        "password: ",
        password
      );
      const signupSuccess = await signup(name, phone, email, password);
      if (signupSuccess) {
        navigate("/signin");
      }
    } catch (error) {
      alert("회원가입 실패: " + error.message);
    }
  };

  const formatPhoneNumber = useCallback((value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength <= 3) return phoneNumber;
    if (phoneNumberLength <= 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  }, []);

  const handlePhoneChange = useCallback((e, onChange) => {
    const inputValue = e.target.value;
    const currentValue = inputValue.replace(/[^\d]/g, '');
    const formattedValue = formatPhoneNumber(currentValue);
    onChange(formattedValue);
  }, [formatPhoneNumber]);

  const { naver } = window;
  const NAVER_CLIENT_ID = process.env.REACT_APP_CLIENT_ID; // 발급 받은 Client ID 입력
  const NAVER_CALLBACK_URL = process.env.REACT_APP_CALLBACK_URL; // 작성했던 Callback URL 입력

  const naverLogin = new naver.LoginWithNaverId({
    clientId: NAVER_CLIENT_ID, // Naver Developer 에 있는 Client ID
    callbackUrl: NAVER_CALLBACK_URL, // 요청 보냈을때 네이버에서 응답해 줄 주소
    isPopup: false, // 네이버 로그인 확인 창을 팝업으로 띄울지 여부
    loginButton: {
      color: "green", // green, white
      type: 3, // 1: 작은버튼, 2: 중간버튼, 3: 큰 버튼
      height: 50, // 크기는 높이로 결정한다.
    },
    callbackHandle: true,
  });

  useEffect(() => {
    naverLogin.init();
  }, []);

  const handleNaverLogin = () => {
    naverLoginRef.current.children[0].click();
  };

  return (
    <>
      <Header />
      <main className="signup-background">
        <div className="signup-box">
          <h3 className="signup-title">회원가입</h3>
          <div>
            <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="signup-input-group">
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <div className="signup-input">
                      <label htmlFor="name" className="signup-input-label">
                        이름
                      </label>
                      <Input
                        {...field}
                        type="text"
                        placeholder="이름을 입력하세요"
                      />
                      {errors.name && (
                        <p className="input-error-message">
                          {errors.name?.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <div className="signup-input">
                      <label htmlFor="tel" className="signup-input-label">
                        연락처
                      </label>
                      <Input
                        type="tel"
                        placeholder="연락처를 입력하세요"
                        value={value}
                        onChange={(e) => handlePhoneChange(e, onChange)}
                      />
                      {errors.phone && (
                        <p className="input-error-message">
                          {errors.phone?.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <div className="signup-input">
                      <label htmlFor="email" className="signup-input-label">
                        Email
                      </label>
                      <Input
                        {...field}
                        type="email"
                        placeholder="이메일주소를 입력하세요"
                      />
                      {errors.email && (
                        <p className="input-error-message">
                          {errors.email?.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <div className="signup-input">
                      <label htmlFor="password" className="signup-input-label">
                        비밀번호
                      </label>
                      <Input
                        {...field}
                        type="password"
                        placeholder="비밀번호를 입력하세요(문자, 숫자 조합 8자 이상)"
                      />
                      {errors.password && (
                        <p className="input-error-message">
                          {errors.password?.message}
                        </p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  name="terms"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <div className="signup-input">
                      <div className="signup-check">
                        <input {...field} type="checkbox" id="terms" />
                        <label htmlFor="terms">
                          <Button onClick={()=>setIsModalOpen(true)} className="signup-modal-button">
                            이용약관 및 정보보호정책 동의
                          </Button>
                        </label>
                      </div>
                      {errors.terms && (
                        <p className="input-error-message">
                          {errors.terms.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
              <Button
                variant="default"
                size="full"
                label={isSubmitting ? "회원가입 중.." : "회원가입"}
                disabled={isSubmitting}
                type="submit"
              />
            </form>
            <div className="signup-signup">
              <p>이미 회원가입을 하셨나요?</p>
              <Link
                to="/signin"
                label="Log in"
                color="#bd9a31"
                buttonStyle="transparent"
                fontSize="14px"
                style={{ width: "fit-content", height: "fit-content" }}
              />
            </div>
            <div className="hr">
              <img className="line-2" alt="Line" src={LineLeft} />
              <div className="OR">OR</div>
              <img className="line-3" alt="Line" src={LineRight} />
            </div>
            <div id="naverIdLogin" ref={naverLoginRef}></div>
            <Button
              variant="auth"
              size="full"
              label="네이버 로그인"
              onClick={handleNaverLogin}
            >
              <img
                className="line-2"
                alt="Line"
                src={naverImage}
                style={{ width: "44px" }}
              />
            </Button>
          </div>
        </div>
        <Modal
          modalTitle="이용약관 및 정보보호정책"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cancelLabel="확인"
        >
          <div className="signup-modal-scroll">
            <PolicyContent />
          </div>
        </Modal>
      </main>
      <Footer />
    </>
  );
};
