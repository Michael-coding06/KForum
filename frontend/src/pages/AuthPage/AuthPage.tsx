import { useState, type FormEvent } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useSignUp from "../../hooks/auth/useSignUp.tsx"

// import "../Page.css";
import useLogIn from "../../hooks/auth/useLogIn.tsx";
const PRIMARY_COLOR = "#5f5a47";

const AuthPage = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const {
    signup,
    loading: signupLoading,
    error: signupError,
  } = useSignUp();

  const {
    login,
    loading: loginLoading,
    error: loginError,
  } = useLogIn();

  const isSubmitDisabled =
    !name.trim() || !password.trim();

  const handleSubmitSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(isSignUp && password !== confirmPassword) {
      alert("Passwords do not match");
      return
    }
    await signup(name, password);
  };

  const handleSubmitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(name, password);
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" px={30} className="sign-in">
      <Box>
        <Typography variant="h3" fontWeight="bold" color={PRIMARY_COLOR} mb={2}>
          KForum
        </Typography>
        <Typography variant="h6" fontSize={25} maxWidth="80%" className="description">
          KForum connects people worldwide through open discussions and shared knowledge.
        </Typography>
      </Box>

      <Card sx={{ width: 500, boxShadow: 3, borderRadius: 2 }} className="input-card">
        <CardContent>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            mb={3}
            color={PRIMARY_COLOR}
          >
            {isSignUp ? "Sign Up" : "Welcome back!"}
          </Typography>

          <Box component="form" onSubmit={isSignUp ? handleSubmitSignUp : handleSubmitLogin}>
            <TextField
              fullWidth
              autoFocus
              label="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-field"
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              className="form-field"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {isSignUp && (
              <TextField
                fullWidth
                label="Confirm your password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                className="form-field"
              />
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              className="submit-button"
              disabled={isSubmitDisabled}
            >
              {isSignUp ? "Sign Up" : "Log In"}
            </Button>

            <Typography textAlign="center" mt={2} color="text.secondary">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <Link
                sx={{
                  color: PRIMARY_COLOR,
                  fontWeight: 600,
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => setIsSignUp((prev) => !prev)}
              >
                {isSignUp ? "Log In" : "Sign Up"}
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthPage;
