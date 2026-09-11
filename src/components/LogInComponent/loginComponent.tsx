import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/authContext";
import { capsuleCorpLogo } from "../../services/artwork";
import "./loginComponent.css";

interface LoginFormData {
  username: string;
}

interface LoginLocationState {
  from?: {
    pathname?: string;
  };
}

const LogInComponent = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LoginLocationState | null;
  const destination = state?.from?.pathname && state.from.pathname !== "/login" ? state.from.pathname : "/homepage";
  const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<LoginFormData>({ mode: "onChange" });

  const onSubmit = ({ username }: LoginFormData) => {
    login(username);
    navigate(destination, { replace: true });
  };

  return (
    <main className="background-login">
      <section className="login-panel" aria-labelledby="login-title">
        <img className="login-logo" src={capsuleCorpLogo} alt="Capsule Corp" />
        <h1 id="login-title">Capsule Corp</h1>
        <p className="login-copy">Enter your name to open the collection. This is a demo, so no password is required.</p>
        <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="login-label" htmlFor="username">Your name</label>
          <input
            id="username"
            className="input-form"
            type="text"
            autoComplete="nickname"
            autoFocus
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? "username-error" : "username-help"}
            {...register("username", {
              required: "Please enter your name.",
              minLength: { value: 2, message: "Use at least 2 characters." },
              maxLength: { value: 24, message: "Use 24 characters or fewer." },
              validate: value => value.trim().length >= 2 || "Please enter a valid name."
            })}
          />
          {errors.username ? <span className="error" id="username-error" role="alert">{errors.username.message}</span> : <span className="login-help" id="username-help">Your name is stored only in this browser.</span>}
          <button type="submit" className="login-form" disabled={!isValid || isSubmitting}>
            <span className="rectangle-login"></span>
            <span className="login-form2">{isSubmitting ? "Opening..." : "Log in"}</span>
          </button>
        </form>
      </section>
    </main>
  );
};

export default LogInComponent;
