import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import { auth } from "../../store";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Header, Footer, Input, Link, Button } from "../../components";

const schema = yup
  .object({
    email: yup
      .string()
      .required("이메일 주소를 입력하세요")
      .email("유효한 이메일 주소를 입력하세요"),
    password: yup.string().required("비밀번호를 입력하세요"),
  })
  .required();

export const SignIn = () => {
  const login = auth((state) => state.login);
  const naverLoginRef = useRef();
  const navigate = useNavigate();
  const [rememberEmail, setRememberEmail] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setValue("email", savedEmail);
      setRememberEmail(true); // rememberEmail 상태를 true로 설정합니다.
    } else {
      setValue("email", "");
      setRememberEmail(false); // 저장된 이메일이 없다면 false로 설정합니다.
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    const { email, password } = data;
    if (rememberEmail) {
      localStorage.setItem("savedEmail", email);
    } else {
      localStorage.removeItem("savedEmail");
    }
    const loginSuccess = await login(email, password);
    if (loginSuccess) {
      navigate("/");
    }
  };

  const { naver } = window;
  const NAVER_CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const NAVER_CALLBACK_URL = process.env.REACT_APP_CALLBACK_URL;

  const initializeNaverLogin = useCallback(() => {
    const naverLogin = new naver.LoginWithNaverId({
      clientId: NAVER_CLIENT_ID,
      callbackUrl: NAVER_CALLBACK_URL,
      isPopup: false,
      loginButton: {
        color: "green",
        type: 3,
        height: 50,
      },
      callbackHandle: true,
    });
    naverLogin.init();
  }, [NAVER_CLIENT_ID, NAVER_CALLBACK_URL, naver]);

  useEffect(() => {
    initializeNaverLogin();
  }, [initializeNaverLogin]);

  const handleNaverLogin = () => {
    naverLoginRef.current.children[0].click();
  };

  return (
    <>
      <Header />
      <main className="signin-background">
        <div className="signin-box">
          <h3 className="signin-title">로그인</h3>
          <div>
            <form className="signin-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="signin-input">
                <label htmlFor="email" className="signin-input-label">
                  Email
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="이메일주소를 입력하세요"
                    />
                  )}
                />
                {errors.email && (
                  <p className="input-error-message">{errors.email.message}</p>
                )}
              </div>
              <div className="signin-input">
                <label htmlFor="password" className="signin-input-label">
                  비밀번호
                </label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                    />
                  )}
                />
                {errors.password && (
                  <p className="input-error-message">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="signin-check-group">
                <Controller
                  name="rememberEmail"
                  control={control}
                  render={({ field }) => (
                    <div className="signin-check">
                      <input
                        {...field}
                        type="checkbox"
                        id="saveEmail"
                        checked={rememberEmail}
                        onChange={(e) => {
                          setRememberEmail(e.target.checked);
                          field.onChange(e.target.checked);
                        }}
                      />
                      <label htmlFor="saveEmail">아이디 기억하기</label>
                    </div>
                  )}
                />
                <Link
                  to="/"
                  label="Forgot password?"
                  color="#bd9a31"
                  buttonStyle="transparent"
                  fontSize="14px"
                  style={{ width: "fit-content", height: "fit-content" }}
                />
              </div>
              <Button
                variant="default"
                size="full"
                type="submit"
                label={isSubmitting ? "로그인 중.." : "로그인"}
                disabled={isSubmitting}
              />
            </form>
            <div className="signin-signup">
              <p>Don't have an account?</p>
              <Link
                to="/signup"
                label="Sign up"
                color="#bd9a31"
                buttonStyle="transparent"
                fontSize="14px"
                style={{ width: "fit-content", height: "fit-content" }}
              />
            </div>
            <div className="hr">
              <img className="line-2" alt="Line" src="/icons/line-left.svg" />
              <div className="OR">OR</div>
              <img className="line-3" alt="Line" src="/icons/line-right.svg" />
            </div>
            <div id="naverIdLogin" ref={naverLoginRef} />
            <Button
              variant="auth"
              size="full"
              label="네이버 로그인"
              onClick={handleNaverLogin}
            >
              <img
                className="line-2"
                alt="Line"
                src="/images/naver.png"
                style={{ width: "44px" }}
              />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
