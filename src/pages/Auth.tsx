import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isLogin) {
        // Vérification pour l'inscription
        if (!captchaValue) {
          toast.error("Veuillez valider le captcha");
          return;
        }
        if (password.length < 6) {
          toast.error("Le mot de passe doit contenir au moins 6 caractères");
          return;
        }
        if (!username) {
          toast.error("Le nom d'utilisateur est requis");
          return;
        }
        if (!email) {
          toast.error("L'email est requis");
          return;
        }

        // Simulation d'une requête d'inscription
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Inscription réussie !");
        navigate("/");
      } else {
        // Simulation d'une requête de connexion
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Connexion réussie !");
        navigate("/");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="absolute top-8 left-8 text-gray-600 hover:text-gray-900">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        
        <img 
          src="/lovable-uploads/e3b929be-d96d-4470-869a-739d4e330db4.png"
          alt="Mokolo Online Logo"
          className="mx-auto h-16 w-auto"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? "Connexion à votre compte" : "Créer un compte"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Nom d'utilisateur
                </label>
                <div className="mt-1">
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {!isLogin && (
              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  onChange={(value) => setCaptchaValue(value)}
                />
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  "Chargement..."
                ) : (
                  isLogin ? "Se connecter" : "S'inscrire"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setIsLogin(!isLogin);
                setCaptchaValue(null);
              }}
            >
              {isLogin
                ? "Pas encore de compte ? S'inscrire"
                : "Déjà un compte ? Se connecter"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}