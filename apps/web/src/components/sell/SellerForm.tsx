"use client";

import { useState } from "react";
import { SellerSignUpForm } from "./SellerSignUpForm";
import { SellerLoginForm } from "./SellerLoginForm";

export function SellerForm() {
  const [isSignUp, setIsSignUp] = useState(true);

  const switchToLogin = () => setIsSignUp(false);
  const switchToSignUp = () => setIsSignUp(true);

  return isSignUp ? (
    <SellerSignUpForm onSwitchToLogin={switchToLogin} />
  ) : (
    <SellerLoginForm onSwitchToSignUp={switchToSignUp} />
  );
}
