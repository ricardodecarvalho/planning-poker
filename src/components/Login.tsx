import useAuth from "../hooks/useAuth";

const Login = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <div>
      <h1>Login</h1>
      <button onClick={loginWithGoogle}>Login with Google to continue</button>
    </div>
  );
};

export default Login;
