import { Button, Footer, Header, Input } from "../../components"
import { useForm, Controller } from "react-hook-form";
import { auth } from "../../store";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./FindPassword.css"

const schema = yup
  .object({
    email: yup
      .string()
      .required("이메일 주소를 입력하세요")
      .email("유효한 이메일 주소를 입력하세요"),
    password: yup.string().required("비밀번호를 입력하세요"),
  })
  .required();

export const FindPassword = () => {
    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
      } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
          email: "",
        },
      });

    return (
        <>
            <Header />
            <main className="signup-background">
                <div className="find-password-box">
                <h3 className="signup-title">비밀번호 찾기</h3>
                <div className="find-password-content">
                    <form className="signin-form" onSubmit={handleSubmit()}>
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
                        <Button
                            variant="default"
                            size="full"
                            type="submit"
                            label={isSubmitting ? "전송 중.." : "비밀번호 재설정 링크 보내기"}
                            disabled={isSubmitting}
                        />
                    </form>
                </div>
            </div>
            </main>
            <Footer />
        </>
    )
}