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
  })
  .required();

export const FindPassword = () => {
    const checkEmail = auth((state) => state.checkEmail);
    const resetPassword = auth((state) => state.resetPassword);
    const {
        handleSubmit,
        control,
        setError,
        formState: { errors, isSubmitting },
      } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
          email: "",
        },
        mode: 'onSubmit',
      });

      const onSubmit = async (data) => {
        const res = await checkEmail(data)
        if(res){
            if(res.exists === true){
                try {
                    const sendEmail = await resetPassword(data);
                    if(sendEmail){
                        alert(sendEmail.message)
                    }
                } catch (error) {
                    alert("이메일 전송이 정상적으로 이뤄지지 않았습니다.")
                }
            }else{
                setError("email", {
                    type: "manual",
                    message: "희망과학심리상담센터에 가입한 이메일이 아닙니다.",
                });
            }
        }
      };

    return (
        <>
            <Header />
            <main className="signup-background">
                <div className="find-password-box">
                <h3 className="signup-title">비밀번호 찾기</h3>
                <div className="find-password-content">
                    <form className="signin-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="signin-input">
                            <label htmlFor="email" className="signin-input-label">
                            아이디(가입한 계정 이메일)
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
