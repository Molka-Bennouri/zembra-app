import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const { register, loginWithGoogle, loginWithGithub } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
      return;
    }

    setIsLoading(true);
    const result = await register({ full_name: fullName, email, password });
    setIsLoading(false);

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="signup-branding">
          <div className="signup-logo"></div>
          <h1 className="signup-headline">
            Start building with Zembra API today
          </h1>
          <p className="signup-subheadline">
            Join thousands of developers using our API to access business data
            across multiple platforms.
          </p>
          <div className="signup-features">
            <div className="signup-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Free tier with 1,000 requests/month</span>
            </div>
            <div className="signup-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="signup-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Get started in minutes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="signup-right">
        <div className="signup-form-container">
          <div className="signup-form-header">
            <h2 className="signup-form-title">Create your account</h2>
            <p className="signup-form-subtitle">
              Sign up for free and start using Zembra API
            </p>
          </div>

          {error && (
            <div className="signup-error">
              <i className="fa-solid fa-circle-info" style={{ fontSize: 16 }}></i>
              {error}
            </div>
          )}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-field">
              <label className="signup-label" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                className="signup-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="signup-field">
              <label className="signup-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="signup-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="signup-fields-row">
              <div className="signup-field">
                <label className="signup-label" htmlFor="password">Password</label>
                <div className="signup-password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="signup-input"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="signup-field">
                <label className="signup-label" htmlFor="confirmPassword">Confirm Password</label>
                <div className="signup-password-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="signup-input"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="signup-terms">
              <label className="signup-checkbox-label">
                <input
                  type="checkbox"
                  className="signup-checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <span className="signup-checkbox-text">
                  I agree to the{" "}
                  <button type="button" className="signup-link" onClick={() => {}}>Terms of Service</button>
                  {" "}and{" "}
                  <button type="button" className="signup-link" onClick={() => {}}>Privacy Policy</button>
                </span>
              </label>
            </div>

            <button type="submit" className="signup-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="signup-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Creating account...
                </>
              ) : (
                "Sign up for free"
              )}
            </button>
          </form>

          <div className="signup-divider">
            <span>or sign up with</span>
          </div>

          <div className="signup-social">
            <button type="button" className="signup-social-btn" onClick={loginWithGoogle}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button type="button" className="signup-social-btn" onClick={loginWithGithub}>
              <i className="fa-brands fa-github" style={{ fontSize: 20 }}></i>
              GitHub
            </button>
          </div>

          <p className="signup-login-text">
            Already have an account?{" "}
            <Link to="/login" className="login-signup-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;