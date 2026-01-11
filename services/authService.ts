// services/authService.ts
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  token: string;
}

// Custom error class for validation failures
class ValidationError extends Error {
  constructor(message: string, public responseData?: any) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Validates password strength requirements
 * @param password - Password to validate
 * @returns Error message if validation fails, undefined if valid
 */
function validatePassword(password: string): string | undefined {
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters";
  }

  // Check for at least one uppercase, one lowercase, one digit, and one special character
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]/.test(
    password
  );

  const missingRequirements = [];
  if (!hasUppercase) missingRequirements.push("uppercase letter");
  if (!hasLowercase) missingRequirements.push("lowercase letter");
  if (!hasDigit) missingRequirements.push("number");
  if (!hasSpecialChar) missingRequirements.push("special character");

  if (missingRequirements.length > 0) {
    return `Password must include: ${missingRequirements.join(", ")}`;
  }

  return undefined; // Password is valid
}

class AuthService {
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/signin`, credentials);
    return response.data;
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    // Client-side password validation
    const passwordErrors = validatePassword(data.password);
    if (passwordErrors) {
      throw {
        message: "Password validation failed",
        status: 400,
        fieldErrors: { password: passwordErrors },
      };
    }

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, data);

      // Validate response structure
      if (!response.data || !response.data.user || !response.data.token) {
        throw new ValidationError(
          "Invalid authentication response: missing user or token",
          response.data
        );
      }

      // Response conforms to AuthResponse interface
      const authResponse: AuthResponse = response.data;

      // Token persistence is handled automatically by zustand's persist middleware
      // in the auth store when setUser is called with the response data

      return authResponse;
    } catch (error) {
      // Handle different error types consistently
      if (axios.isAxiosError(error)) {
        // Network errors or API validation failures
        const status = error.response?.status || 500;
        const message =
          error.response?.data?.message ||
          error.message ||
          "Sign up failed due to network error";
        const fieldErrors = error.response?.data?.errors || {};

        console.error("Sign up API error:", {
          status,
          message,
          fieldErrors,
          response: error.response?.data,
        });

        throw {
          message,
          status,
          fieldErrors,
        };
      } else if (error instanceof ValidationError) {
        // Re-throw validation errors as-is
        console.error("Validation error:", error.message);
        throw error;
      } else {
        // Unexpected errors
        console.error("Unexpected sign up error:", error);
        throw {
          message: "An unexpected error occurred during sign up",
          status: 500,
        };
      }
    }
  }

  /**
   * Sends password reset email with comprehensive error handling
   * @param email - User's email address
   * @returns Promise resolving to structured result with success status and messages
   * @throws ValidationError for validation failures with response details
   */
  async sendPasswordResetEmail(email: string): Promise<{
    success: boolean;
    message?: string;
    error?: { message: string; details?: any };
  }> {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });

      // Success case - return structured result
      return {
        success: true,
        message:
          response.data?.message || "Password reset email sent successfully",
      };
    } catch (error: unknown) {
      // Log error with context for debugging
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Password reset email failed:", errorMessage);

      // Handle different error types consistently
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const apiMessage =
          error.response?.data?.message || "Password reset request failed";
        const details = error.response?.data;

        // Check for validation errors (e.g., invalid email format)
        if (status === 400 || status === 422) {
          throw new ValidationError(
            "Password reset validation failed",
            details
          );
        }

        // Return structured error for non-validation failures
        return {
          success: false,
          error: {
            message: apiMessage,
            details,
          },
        };
      } else if (error instanceof ValidationError) {
        // Re-throw validation errors to be handled by caller
        throw error;
      } else {
        // Unexpected errors - return structured error
        return {
          success: false,
          error: {
            message:
              "An unexpected error occurred while sending password reset email",
            details: error instanceof Error ? error.message : String(error),
          },
        };
      }
    }
  }

  async signInWithApple(): Promise<AuthResponse> {
    // TODO: Implement Apple Sign In
    throw new Error("Not implemented");
  }

  async signInWithGoogle(): Promise<AuthResponse> {
    // TODO: Implement Google Sign In
    throw new Error("Not implemented");
  }

  async signInWithFacebook(): Promise<AuthResponse> {
    // TODO: Implement Facebook Sign In
    throw new Error("Not implemented");
  }
}

export const authService = new AuthService();
