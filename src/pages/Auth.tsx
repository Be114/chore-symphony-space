import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      toast.error("メールアドレスとパスワードを入力してください");
      return false;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("有効なメールアドレスを入力してください");
      return false;
    }

    if (password.length < 6) {
      toast.error("パスワードは6文字以上で入力してください");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent, type: "login" | "signup") => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (type === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        if (data.user && data.user.identities && data.user.identities.length === 0) {
          toast.error("このメールアドレスは既に登録されています");
          return;
        }

        toast.success(
          "アカウント作成のメールを送信しました。メールを確認してアカウントを有効化してください。"
        );
        setIsSignUp(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("メールアドレスまたはパスワードが正しくありません");
          }
          throw error;
        }

        toast.success("ログインしました");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Todo App</h1>
          <p className="text-muted-foreground mt-2">
            {isSignUp
              ? "メールを確認してアカウントを有効化してください"
              : "アカウントを作成してタスクを管理しましょう"}
          </p>
        </div>

        {!isSignUp && (
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6文字以上で入力"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                onClick={(e) => handleSubmit(e, "login")}
              >
                {isLoading ? "処理中..." : "ログイン"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isLoading}
                onClick={(e) => handleSubmit(e, "signup")}
              >
                {isLoading ? "処理中..." : "アカウント作成"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
