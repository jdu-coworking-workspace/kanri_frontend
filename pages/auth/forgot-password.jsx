import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Seo from "@/components/Seo/Seo";
import { Button, BaseInput } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const validate = () => {
    if (!email.trim()) {
      return "メールアドレスを入力してください。";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "正しいメールアドレスを入力してください。";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // TODO: API call
      console.log("Forgot password:", email);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (err) {
      console.error("Forgot password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="パスワードをお忘れの方 — Kanri"
        description="パスワードをリセットするためのリンクをメールでお送りします。"
      />

      <div className="min-h-screen flex">
        {/* ====== Chap tomon — Forgot Password Forma ====== */}
        <div className="flex-1 flex flex-col justify-between px-6 py-8 sm:px-12 lg:px-20 xl:px-28">
          {/* Logo / Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-bold text-[#0A1D37] tracking-tight"
            >
            </Link>
          </div>

          {/* Forma */}
          <div className="w-full max-w-[400px]">
            {!isSubmitted ? (
              <>
                {/* Sarlavha */}
                <div className="mb-8">
                  <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0A1D37] leading-tight mb-3">
                    パスワードをお忘れですか？
                  </h1>
                  <p className="text-[15px] text-[#6B7280] leading-relaxed">
                    ご心配なく。登録済みのメールアドレスを入力し
                    <br className="hidden sm:block" />
                    てください。パスワードをリセットするためのリ
                    <br className="hidden sm:block" />
                    ンクをお送りします。
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <BaseInput
                    id="forgot-email"
                    label="メールアドレス"
                    name="email"
                    type="email"
                    placeholder="Example@email.com"
                    value={email}
                    onChange={handleChange}
                    error={error}
                    autoComplete="email"
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                  >
                    リセットリンクを送信
                  </Button>

                  {/* Back to Login */}
                  <div className="text-center">
                    <Link
                      href="/auth/login"
                      className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#0A1D37] transition-colors duration-150 font-medium"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      ログインに戻る
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              /* ====== Muvaffaqiyatli yuborilgandan keyin ====== */
              <div className="text-center">
                {/* Success Icon */}
                <div className="w-16 h-16 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-8 h-8"
                  >
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                </div>

                <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0A1D37] leading-tight mb-3">
                  メールを送信しました ✉️
                </h1>
                <p className="text-[15px] text-[#6B7280] leading-relaxed mb-8">
                  <span className="font-semibold text-[#0A1D37]">{email}</span>
                  <br />
                  にパスワードリセットリンクを送信しました。
                  <br />
                  メールをご確認ください。
                </p>

                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                  >
                    別のメールアドレスを試す
                  </Button>

                  <Link href="/auth/login" className="block">
                    <Button variant="auth-outline" size="lg" fullWidth>
                      ログインに戻る
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div>
            <p className="text-xs text-[#9CA3AF] tracking-wider">
              © 2026 ALL RIGHTS RESERVED
            </p>
          </div>
        </div>

        {/* ====== O'ng tomon — Cover Rasm ====== */}
        <div className="hidden lg:block lg:w-[45%] xl:w-[50%] p-3">
          <div className="relative w-full h-full rounded-3xl overflow-hidden">
            <Image
              src="/images/forgot-cover.png"
              alt="Modern loft office space"
              fill
              className="object-cover"
              priority
              unoptimized
              sizes="(min-width: 1024px) 50vw, 0vw"
            />
          </div>
        </div>
      </div>
    </>
  );
}

// Auth sahifalar uchun AuthLayout ishlatish
ForgotPasswordPage.layout = "auth";
