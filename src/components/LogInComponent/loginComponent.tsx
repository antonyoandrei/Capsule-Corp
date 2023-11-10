import { useNavigate } from "react-router-dom";
import "./loginComponent.css"
import { useForm } from 'react-hook-form';
import { useContext } from "react";
import { AuthContext } from "../Auth/authContext";

const LogInComponent = () => {
  const { register, handleSubmit, formState: { errors, isValid }, getValues} = useForm({mode: "onChange"});
  const onSubmit = (data: any) => console.log(data);

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

    const onLogin = () => {
      if (isValid) {
      const username = getValues("username");
      login(username)
        navigate('/', {
            replace: true
        });
      }
    }
    
  return (
    <>
    <div className="background-login"></div>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <input
        className="input-form"
        type="text"
        placeholder="Username"
        {...register("username", {
          required: "Please enter your username.",
          minLength: { value: 4, message: "Username must be at least 4 characters long." },
          maxLength: { value: 15, message: "Username must be at most 15 characters long." }
        })}
      />      
      {typeof errors?.username?.message === 'string' && (
      <span className="error">{errors.username.message}</span> 
      )}
      <button type="submit" className="login-form" onClick={onLogin}>
          <div className="rectangle-login"></div>
          <div className="login-form2">Log In</div>
        </button>
      </form>
    </>
    );
}

export default LogInComponent;
